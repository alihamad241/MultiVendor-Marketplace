import Order from "../models/order.model.js";
import Store from "../models/store.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

export const getVendorOrders = async (req, res) => {
    try {
        const store = await Store.findOne({ owner: req.user._id });
        if (!store) return res.status(404).json({ message: "Store not found for this vendor" });

        const orders = await Order.find({ store: store._id })
            .populate("user", "name email")
            .populate("products.product", "name image")
            .sort({ createdAt: -1 });

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Error fetching vendor orders", error: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id).populate("store");
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Ensure the requester is the owner of the store linked to this order
        if (order.store.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to update this order" });
        }

        const oldStatus = order.status;
        order.status = status;
        await order.save();

        // Stock Logic: If status changed to "confirmed", decrement stock
        if (status === "confirmed" && oldStatus !== "confirmed") {
            try {
                for (const item of order.products) {
                    await Product.findByIdAndUpdate(item.product, {
                        $inc: { stock: -item.quantity }
                    });
                }
            } catch (err) {
                console.error("Error decrementing stock on confirmation:", err);
            }
        }

        // Wallet Logic: If status changed to "completed", credit the vendor
        if (status === "completed" && oldStatus !== "completed") {
            const commissionRate = order.store.commissionRate || 10;
            const amountToCredit = order.totalAmount * (1 - commissionRate / 100);

            await User.findByIdAndUpdate(order.store.owner, {
                $inc: { walletBalance: amountToCredit }
            });
        }

        res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate("store", "name logo_image")
            .populate("products.product", "name image price");
            
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error fetching order", error: error.message });
    }
};
