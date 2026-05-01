async function buildCartResponse(user) {
    const productIds = user.cartItems.map((item) => item.product && item.product.toString()).filter(Boolean);
    const products = await Product.find({ _id: { $in: productIds } });

    const cartItems = products.map((product) => {
        const item = user.cartItems.find((cartItem) => cartItem.product && cartItem.product.toString() === product._id.toString());
        return {
            ...product.toJSON(),
            quantity: item ? item.quantity : 1,
        };
    });

    return cartItems;
}
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        // Find if this product already exists in the user's cart
        const existingItem = user.cartItems.find((item) => {
            // each cart item stores a `product` ObjectId reference
            return item.product && item.product.toString() === productId;
        });

        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 0) + 1;
        } else {
            // push a subdocument with product reference and initial quantity
            user.cartItems.push({ product: productId, quantity: 1 });
        }

        await user.save();
        const cartItems = await buildCartResponse(user);
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Error adding to cart", error });
    }
};

export const removeAllFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        if (!productId) {
            // Clear entire cart
            user.cartItems = [];
        } else {
            // Remove items whose product id matches
            user.cartItems = user.cartItems.filter((item) => {
                return !(item.product && item.product.toString() === productId);
            });
        }

        await user.save();
        const cartItems = await buildCartResponse(user);
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Error removing from cart", error });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;
        const existingItem = user.cartItems.find((item) => item.product && item.product.toString() === productId);
        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter((item) => !(item.product && item.product.toString() === productId));
                await user.save();
                const cartItems = await buildCartResponse(user);
                return res.json(cartItems);
            }

            existingItem.quantity = quantity;
            await user.save();
            const cartItems = await buildCartResponse(user);
            res.json(cartItems);
        } else {
            res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating quantity", error });
    }
};

export const getCartProducts = async (req, res) => {
    try {
        // Collect product ids referenced in the user's cart
        const productIds = req.user.cartItems.map((item) => item.product && item.product.toString()).filter(Boolean);
        const products = await Product.find({ _id: { $in: productIds } });

        // Map product documents to include the quantity from the user's cart
        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find((cartItem) => cartItem.product && cartItem.product.toString() === product._id.toString());
            return {
                ...product.toJSON(),
                quantity: item ? item.quantity : 1,
            };
        });
        // console.log(cartItems);

        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching cart products",
            error,
        });
    }
};
