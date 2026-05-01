import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import axios from "../libs/axios";

const CartTotals = () => {
    const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

    const shipping = 15;
    const discount = coupon && coupon.discountPercentage ? subtotal * (coupon.discountPercentage / 100) : 0;
    const savings = discount; // display coupon discount as savings
    const formattedShipping = shipping.toFixed(2);
    const formattedSubtotal = subtotal.toFixed(2);
    const formattedTotal = total.toFixed(2);
    const formattedSavings = savings.toFixed(2);

    const [processing, setProcessing] = useState(false);

    const handlePayment = async () => {
        try {
            setProcessing(true);

            // Build payload with quantities to match server expectations
            const productsPayload = (cart || []).map((item) => ({
                _id: item._id,
                name: item.name || item.title,
                image: item.image,
                price: item.price,
                quantity: item.quantity || 1,
            }));

            const res = await axios.post("/payment/create-checkout-session", {
                products: productsPayload,
                couponCode: coupon ? coupon.code : null,
            });

            if (res.data && res.data.url) {
                // Redirect browser to Stripe hosted Checkout page (recommended)
                window.location.href = res.data.url;
                return;
            }

            console.error("No checkout URL returned from server", res.data);
            setProcessing(false);
        } catch (err) {
            console.error("Checkout error:", err);
            setProcessing(false);
        }
    };

    return (
        <div className="w-full border shadow-md bg-white">
            {/* Header */}
            <div className="bg-black text-white px-4 py-2 font-bold">CART TOTALS</div>

            <div className="p-4 space-y-3">
                {/* Subtotal */}
                <div className="flex justify-between text-gray-700">
                    <span className="font-bold">Subtotal</span>
                    <span>${formattedSubtotal}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-gray-700">
                    <span className="font-bold">Shipping</span>
                    <span>Flat Rate: ${formattedShipping}</span>
                </div>

                {/* Discount / Coupon */}
                {coupon && coupon.discountPercentage ? (
                    <div className="flex justify-between text-gray-700">
                        <span className="font-bold">Discount ({coupon.code})</span>
                        <span className="text-red-600">-${formattedSavings}</span>
                    </div>
                ) : null}

                {/* Right-aligned Calculate Shipping above total */}
                <p className="text-right text-sm text-red-600 cursor-pointer">Calculate shipping</p>

                {/* Total */}
                <div className="flex justify-between border-t border-gray-300 pt-2 text-gray-900">
                    <span className="font-bold">Total</span>
                    <span>${formattedTotal}</span>
                </div>

                {/* Checkout button */}
                <div className="text-right">
                    <button
                        onClick={handlePayment}
                        disabled={processing || !cart || cart.length === 0}
                        className={`px-4 inline-block text-white py-2 font-bold transition-colors duration-200 ${
                            processing || !cart || cart.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-[#00BBA6] hover:bg-[#009f89]"
                        }`}>
                        {processing ? "Processing..." : "PROCEED TO CHECKOUT"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartTotals;
