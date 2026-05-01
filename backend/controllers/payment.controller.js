import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import { stripe } from "../libs/stripe.js";
import mongoose from "mongoose";

const escapeRegExp = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createCheckoutSession = async (req, res) => {
    try {
        const { products, couponCode } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty products array" });
        }

        let totalAmount = 0;

        const lineItems = products.map((product) => {
            const amount = Math.round(product.price * 100); // stripe wants u to send in the format of cents
            totalAmount += amount * product.quantity;

            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: amount,
                },
                quantity: product.quantity || 1,
            };
        });

        // Add flat shipping as its own line item (15 USD)
        const SHIPPING_CENTS = 1500;
        lineItems.push({
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Shipping (Flat Rate)",
                },
                unit_amount: SHIPPING_CENTS,
            },
            quantity: 1,
        });
        totalAmount += SHIPPING_CENTS;

        let coupon = null;
        if (couponCode) {
            // case-insensitive exact match for coupon code (global coupons)
            coupon = await Coupon.findOne({ code: { $regex: `^${escapeRegExp(String(couponCode).trim())}$`, $options: "i" }, isActive: true });
            if (coupon) {
                totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
            }
        }

        // Build a base URL that points to this server so Stripe redirects back here
        // after checkout instead of the client dev server. You can set `SERVER_URL`
        // in your environment (e.g. http://localhost:5000). If not set, fall back
        // to localhost with the backend PORT.
        // const serverBase = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
        const serverBase = process.env.NODE_ENV === "development"
            ? `http://localhost:${process.env.PORT || 5000}`
            : process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${serverBase}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${serverBase}/purchase-cancel`,
            discounts: coupon
                ? [
                      {
                          coupon: await createStripeCoupon(coupon.discountPercentage),
                      },
                  ]
                : [],
            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map((p) => ({
                        id: p._id,
                        quantity: p.quantity,
                        price: p.price,
                    }))
                ),
            },
        });

        if (totalAmount >= 20000) {
            await createNewCoupon(req.user._id);
        }

        // Newer Stripe versions no longer support client-side `redirectToCheckout`.
        // The recommended approach is to redirect the browser to the Checkout URL
        // returned in `session.url` (hosted Checkout page).
        res.status(200).json({
            id: session.id,
            url: session.url,
            totalAmount: totalAmount / 100,
        });
    } catch (error) {
        console.error("Error processing checkout:", error);
        res.status(500).json({
            message: "Error processing checkout",
            error: error.message,
        });
    }
};

export const checkoutSuccess = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            if (session.metadata.couponCode) {
                await Coupon.findOneAndUpdate(
                    { code: { $regex: `^${escapeRegExp(String(session.metadata.couponCode).trim())}$`, $options: "i" } },
                    { isActive: false }
                );
            }

            // create a new Order
            const products = JSON.parse(session.metadata.products);
            const newOrder = new Order({
                user: session.metadata.userId,
                products: products.map((product) => ({
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalAmount: session.amount_total / 100, // convert from cents to dollars,
                stripeSessionId: sessionId,
            });

            await newOrder.save();

            // Ensure the user's `orders` array contains this order id so
            // older codepaths that rely on `user.orders` will work.
            try {
                const userId = session.metadata.userId;
                if (userId) {
                    await User.findByIdAndUpdate(userId, { $push: { orders: newOrder._id } });
                }
            } catch (err) {
                console.error("Failed to push order id to user.orders:", err);
            }

            // Clear the user's cart now that the order was created
            try {
                const userId = session.metadata.userId || req.user?._id;
                if (userId) {
                    await User.findByIdAndUpdate(userId, { cartItems: [] });
                }
            } catch (err) {
                console.error("Failed to clear cart after checkoutSuccess:", err);
            }

            res.status(200).json({
                success: true,
                message: "Payment successful, order created, and coupon deactivated if used.",
                orderId: newOrder._id,
            });
        }
    } catch (error) {
        console.error("Error processing successful checkout:", error);
        res.status(500).json({
            message: "Error processing successful checkout",
            error: error.message,
        });
    }
};

export const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];

    try {
        // Use the raw body (buffer) when available; express.json with a
        // `verify` function saved it to req.rawBody above in server.js.
        const payload = req.rawBody || req.body;
        const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;

            // Avoid duplicate processing
            const existing = await Order.findOne({
                stripeSessionId: session.id,
            });
            if (existing) {
                return res.status(200).send({ received: true });
            }

            // Deactivate coupon if used (global lookup by code)
            if (session.metadata && session.metadata.couponCode) {
                await Coupon.findOneAndUpdate(
                    { code: { $regex: `^${escapeRegExp(String(session.metadata.couponCode).trim())}$`, $options: "i" } },
                    { isActive: false }
                );
            }

            // Create order from session metadata
            if (session.metadata && session.metadata.products) {
                const products = JSON.parse(session.metadata.products);

                const newOrder = new Order({
                    user: session.metadata.userId,
                    products: products.map((product) => ({
                        // store the product id string; Mongoose will cast to ObjectId
                        product: product.id,
                        quantity: product.quantity,
                        price: product.price,
                    })),
                    totalAmount: (session.amount_total || 0) / 100,
                    stripeSessionId: session.id,
                    paymentStatus: "paid",
                });

                await newOrder.save();

                    try {
                        const userId = session.metadata.userId;
                        if (userId) {
                            await User.findByIdAndUpdate(userId, { $push: { orders: newOrder._id } });
                        }
                    } catch (err) {
                        console.error("Failed to push order id to user.orders (webhook):", err);
                    }
                // Clear the user's cart (webhook path)
                try {
                    const userId = session.metadata.userId;
                    if (userId) {
                        await User.findByIdAndUpdate(userId, { cartItems: [] });
                    }
                } catch (err) {
                    console.error("Failed to clear cart after webhook order creation:", err);
                }
            }
        }

        res.status(200).send({ received: true });
    } catch (err) {
        console.error("Webhook error:", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
};

// Public endpoint: ensure an order is created from a Checkout Session.
// This is a fallback for environments where webhooks are not configured.
export const createOrderFromSession = async (req, res) => {
    try {
        const sessionId = req.query.session_id || req.query.sessionId || req.body?.sessionId;
        if (!sessionId) return res.status(400).json({ message: "Missing session_id" });

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (!session) return res.status(404).json({ message: "Session not found" });

        if (session.payment_status !== "paid") {
            return res.status(400).json({ message: "Payment not completed" });
        }

        // Avoid duplicate processing
        const existing = await Order.findOne({ stripeSessionId: session.id });
        if (existing) {
            return res.status(200).json({
                message: "Order already exists",
                orderId: existing._id,
            });
        }

        // Deactivate coupon if used (global lookup by code)
        if (session.metadata && session.metadata.couponCode) {
            await Coupon.findOneAndUpdate(
                { code: { $regex: `^${escapeRegExp(String(session.metadata.couponCode).trim())}$`, $options: "i" } },
                { isActive: false }
            );
        }

        if (session.metadata && session.metadata.products) {
            const products = JSON.parse(session.metadata.products);

            const newOrder = new Order({
                user: session.metadata.userId,
                products: products.map((product) => ({
                    // store the product id string; Mongoose will cast to ObjectId
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalAmount: (session.amount_total || 0) / 100,
                stripeSessionId: session.id,
                paymentStatus: "paid",
            });

            await newOrder.save();

                try {
                    const userId = session.metadata.userId;
                    if (userId) {
                        await User.findByIdAndUpdate(userId, { $push: { orders: newOrder._id } });
                    }
                } catch (err) {
                    console.error("Failed to push order id to user.orders (createOrderFromSession):", err);
                }

            // Clear the user's cart (createOrderFromSession fallback)
            try {
                const userId = session.metadata.userId;
                if (userId) {
                    await User.findByIdAndUpdate(userId, { cartItems: [] });
                }
            } catch (err) {
                console.error("Failed to clear cart after createOrderFromSession:", err);
            }

            return res.status(201).json({ message: "Order created", orderId: newOrder._id });
        }

        return res.status(400).json({ message: "Session has no products metadata" });
    } catch (err) {
        console.error("Error creating order from session:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

async function createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once",
    });

    return coupon.id;
}

async function createNewCoupon(/* userId */) {
    // Create a global gift coupon. We intentionally do not attach a userId.
    const code = "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const newCoupon = new Coupon({ code, discountPercentage: 10, expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
    try {
        await newCoupon.save();
        return newCoupon;
    } catch (err) {
        // If code collision (unlikely), try again once
        if (err && err.code === 11000) {
            const code2 = "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase();
            const retry = new Coupon({ code: code2, discountPercentage: 10, expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
            await retry.save();
            return retry;
        }
        throw err;
    }
}
