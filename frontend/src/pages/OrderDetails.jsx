import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useOrdersStore from "../stores/useOrdersStore";
import { toast } from "react-hot-toast";

const OrderDetails = () => {
    const { id } = useParams();
    const orders = useOrdersStore((s) => s.orders);
    const loading = useOrdersStore((s) => s.loading);
    const fetchOrders = useOrdersStore((s) => s.fetchOrders);
    const getOrderById = useOrdersStore((s) => s.getOrderById);

    const [order, setOrder] = useState(() => getOrderById(id));

    useEffect(() => {
        // If order is not already in store, fetch orders and then select
        if (!order) {
            (async () => {
                try {
                    await fetchOrders();
                    const o = getOrderById(id);
                    if (!o) {
                        toast.error("Order not found");
                    }
                    setOrder(o || null);
                } catch (err) {
                    console.error("Failed to load orders for details", err);
                    toast.error("Failed to load order details");
                }
            })();
        }
    }, [id, order, fetchOrders, getOrderById]);

    if (loading && !order) return <div className="p-6">Loading order…</div>;

    if (!order)
        return (
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-3">Order not found</h2>
                <Link
                    to="/my-account"
                    className="text-[#00BBA6] underline">
                    Back to account
                </Link>
            </div>
        );

    const date = order.date ? new Date(order.date).toLocaleString() : order.createdAt ? new Date(order.createdAt).toLocaleString() : "-";
    const total =
        typeof order.totalAmount === "number"
            ? order.totalAmount > 1000
                ? `$${(order.totalAmount / 100).toFixed(2)}`
                : `$${order.totalAmount.toFixed(2)}`
            : order.total || "-";

    return (
        <div className="p-6">
            <div className="mb-4">
                <h2 className="text-2xl font-semibold">Order {order._id || order.id}</h2>
                <div className="text-sm text-gray-500">Placed on {date}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-4 rounded shadow-sm">
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="mt-2 font-semibold">{order.status || "-"}</div>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="mt-2 font-semibold">{total}</div>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                    <div className="text-sm text-gray-500">Shipping Address</div>
                    <div className="mt-2">{order.address || "-"}</div>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-semibold mb-3">Items</h3>
                <div className="space-y-3">
                    {(order.products || []).map((item, idx) => {
                        const prod = item.product || {};
                        const name = prod.name || prod.title || String(prod);
                        const price = typeof item.price === "number" ? `$${item.price.toFixed(2)}` : item.price || "-";
                        return (
                            <div
                                key={idx}
                                className="flex items-center justify-between border rounded p-3">
                                <div>
                                    <div className="font-medium">{name}</div>
                                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold">{price}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
