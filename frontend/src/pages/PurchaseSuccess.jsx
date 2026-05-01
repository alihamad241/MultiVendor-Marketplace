import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useSearchParams } from "react-router-dom";
import axios from "../libs/axios";
import { toast } from "react-hot-toast";
import { useCartStore } from "../stores/useCartStore";

export default function PurchaseSuccess() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id") || searchParams.get("sessionId") || "";
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        const ensureOrder = async () => {
            if (!sessionId) return;
            setLoading(true);
            try {
                const res = await axios.get(`/payment/create-order-from-session?session_id=${encodeURIComponent(sessionId)}`);
                if (res.data && (res.data.orderId || res.data.order_id)) {
                    setOrderId(res.data.orderId || res.data.order_id);
                } else if (res.data && res.data.message) {
                    // If order already exists the API returns message and orderId
                    if (res.data.orderId) setOrderId(res.data.orderId);
                }
            } catch (err) {
                console.error("Error creating order from session:", err);
                toast.error(err?.response?.data?.message || "Failed to create order from session");
            } finally {
                setLoading(false);
                // Refresh cart from server so UI reflects cleared cart after checkout
                try {
                    const getCartItems = useCartStore.getState().getCartItems;
                    if (typeof getCartItems === "function") await getCartItems();
                } catch (e) {
                    // ignore
                }
            }
        };

        ensureOrder();
    }, [sessionId]);

    return (
        <>
            <Header />

            <div className="py-16">
                <div className="max-w-3xl mx-auto bg-white rounded shadow p-8 text-center">
                    <div className="text-green-600 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mx-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-semibold mb-2">Thank you — your purchase was successful!</h1>
                    <p className="text-gray-600 mb-4">We've emailed your receipt and are processing your order.</p>

                    {sessionId && (
                        <div className="text-sm text-gray-500 mb-6">
                            Checkout Session: <code className="bg-gray-100 px-2 py-1 rounded">{sessionId}</code>
                        </div>
                    )}

                    {loading && <div className="mb-4">Finalizing your order...</div>}
                    {orderId && (
                        <div className="mb-4 text-sm text-gray-700">
                            Order created: <strong>{orderId}</strong>
                        </div>
                    )}

                    <div className="flex justify-center gap-3">
                        <Link
                            to="/"
                            className="inline-block bg-[#00BBA6] text-white px-4 py-2 rounded hover:bg-[#009f89]">
                            Return Home
                        </Link>
                        <Link
                            to="/my-account"
                            className="inline-block border border-gray-300 px-4 py-2 rounded hover:bg-gray-50">
                            My Account
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
