import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		min: 1,
	},
	price: {
		type: Number,
		required: true,
		min: 0,
	},
});

const orderSchema = new mongoose.Schema(
	{
		// user who placed the order
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

        date: {
            type: Date,
            default: Date.now,
        },

		// single store per order (Talabat-style)
		store: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Store",
			required: false,
		},

		// items (products + quantity + price at checkout)
		products: [orderItemSchema],

		// total cost
		totalAmount: {
			type: Number,
			required: true,
			min: 0,
		},

        address: {
            type: String,
            required: false,
        },

		// order status workflow
		status: {
			type: String,
			enum: [
				"pending",
				"confirmed",
				"preparing",
				"out_for_delivery",
				"completed",
				"cancelled",
			],
			default: "pending",
		},

		// Stripe support
		stripeSessionId: {
			type: String,
			unique: true,
		},
	},
	{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
