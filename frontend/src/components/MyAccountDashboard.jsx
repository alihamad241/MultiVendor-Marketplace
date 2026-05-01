import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useOrdersStore } from "../stores/useOrdersStore";
import axios from "../libs/axios";
import { toast } from "react-hot-toast";

const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "orders", label: "Orders" },
    { id: "accountDetails", label: "Account Details" },
    { id: "logout", label: "Logout" },
];

const sampleOrders = [
    {
        id: "#1001",
        date: "May 10, 2023",
        status: "Completed",
        total: "$25.00 For 1 Item",
    },
    {
        id: "#1002",
        date: "May 12, 2023",
        status: "Processing",
        total: "$17.00 For 1 Item",
    },
];

export default function MyAccountDashboard({ onLogout }) {
    const [activeTab, setActiveTab] = useState("dashboard");
    const logout = useUserStore((s) => s.logout);
    const user = useUserStore((s) => s.user);
    const navigate = useNavigate();
    const location = useLocation();
    const orders = useOrdersStore((s) => s.orders);
    const ordersLoading = useOrdersStore((s) => s.loading);
    const ordersError = useOrdersStore((s) => s.error);
    const fetchOrders = useOrdersStore((s) => s.fetchOrders);

    useEffect(() => {
        try {
            const params = new URLSearchParams(location.search);
            const tab = params.get("tab");
            if (tab) setActiveTab(tab);
        } catch (err) {
            // ignore
        }
    }, [location.search]);

    const handleLogout = async () => {
        if (onLogout) {
            try {
                await onLogout();
            } catch (err) {
                // ignore — fallback to store logout
            }
        }

        try {
            await logout();
        } catch (err) {
            // logout already shows toast on error
        }
        navigate("/login");
    };

    // fetchOrders comes from useOrdersStore

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {
        if (activeTab === "orders") fetchOrders();
    }, [activeTab, fetchOrders]);

    return (
        <div className="flex flex-wrap gap-x-8 justify-center mt-14 mb-14 p-6">
            <aside className="lg:w-1/6 w-full">
                <ul className="list-none p-0 m-0">
                    {tabs.map((tab) => (
                        <li
                            key={tab.id}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === "Enter" && setActiveTab(tab.id)}
                            onClick={() => setActiveTab(tab.id)}
                            className={`transition-all font-bold mb-1 duration-200 cursor-pointer px-4 py-2 rounded ${
                                tab.id === activeTab ? "bg-[#00BBA6] text-white" : "bg-white text-gray-700"
                            }`}>
                            {tab.label}
                        </li>
                    ))}
                </ul>
            </aside>

            <main className="lg:ms-6 mt-5 lg:w-3/5 w-full">
                {/* Dashboard */}
                <section
                    className={activeTab === "dashboard" ? "block" : "hidden"}
                    aria-hidden={activeTab !== "dashboard"}>
                    <h3 className="mb-5 text-2xl font-semibold">Dashboard</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="text-sm text-gray-500">Orders</div>
                            <div className="mt-2 text-2xl font-bold text-gray-900">{orders.length}</div>
                            <div className="text-xs text-gray-400 mt-1">Recent orders placed</div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="text-sm text-gray-500">Account</div>
                            <div className="mt-2 text-lg font-semibold text-gray-900">{user?.name || "-"}</div>
                            <div className="text-xs text-gray-400 mt-1">{user?.email || "-"}</div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="text-sm text-gray-500">Actions</div>
                            <div className="mt-2 flex flex-col gap-2">
                                <button
                                    onClick={() => setActiveTab("accountDetails")}
                                    className="text-sm px-3 py-2 bg-[#00BBA6] text-white rounded">
                                    Edit account
                                </button>
                                <Link
                                    // to="/my-account?tab=orders"
                                    onClick={() => setActiveTab("orders")}
                                    className="text-sm px-3 py-2 border rounded text-[#00BBA6] text-center">
                                    View orders
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">Recent Orders</h4>
                            <Link
                                onClick={() => setActiveTab("orders")}
                                className="text-sm text-[#00BBA6] hover:underline">
                                See all
                            </Link>
                        </div>

                        {ordersLoading ? (
                            <div className="text-sm text-gray-500">Loading recent orders…</div>
                        ) : orders.length ? (
                            <ul className="space-y-3">
                                {orders.slice(0, 3).map((o) => {
                                    const id = o._id || o.id;
                                    const date = o.date
                                        ? new Date(o.date).toLocaleDateString()
                                        : o.createdAt
                                        ? new Date(o.createdAt).toLocaleDateString()
                                        : "-";
                                    const total =
                                        typeof o.totalAmount === "number"
                                            ? o.totalAmount > 1000
                                                ? `$${(o.totalAmount / 100).toFixed(2)}`
                                                : `$${o.totalAmount.toFixed(2)}`
                                            : o.total || "-";
                                    return (
                                        <li
                                            key={id}
                                            className="flex items-center justify-between border rounded p-3">
                                            <div>
                                                <div className="font-medium">Order {id}</div>
                                                <div className="text-sm text-gray-500">{date}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-gray-900">{total}</div>
                                                <div className="text-xs mt-1 inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700">
                                                    {o.status}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="text-sm text-gray-500">You have no recent orders.</div>
                        )}
                    </div>
                </section>

                {/* Orders */}
                <section
                    className={activeTab === "orders" ? "block" : "hidden"}
                    aria-hidden={activeTab !== "orders"}>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">Orders</h3>
                    <div className="bg-white w-full shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-x divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y-2 divide-gray-200">
                                    {(ordersLoading ? [] : orders.length ? orders : sampleOrders).map((order) => {
                                        const id = order._id || order.id;
                                        const date = order.date
                                            ? new Date(order.date).toLocaleDateString()
                                            : order.createdAt
                                            ? new Date(order.createdAt).toLocaleDateString()
                                            : "-";
                                        const status = order.status || "-";
                                        const total =
                                            typeof order.totalAmount === "number"
                                                ? order.totalAmount > 1000
                                                    ? `$${(order.totalAmount / 100).toFixed(2)}`
                                                    : `$${order.totalAmount.toFixed(2)}`
                                                : order.total || "-";

                                        return (
                                            <tr
                                                key={id}
                                                className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{date}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium text-green-700 bg-green-50">
                                                        {status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{total}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <Link
                                                        to={`/orders/${id}`}
                                                        className="inline-flex items-center gap-1.5 text-pink-600 hover:text-pink-700 font-medium">
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Account Details */}
                <section
                    className={activeTab === "accountDetails" ? "block" : "hidden"}
                    aria-hidden={activeTab !== "accountDetails"}>
                    <h3 className="mb-5 text-2xl font-semibold">Account Details</h3>
                    <AccountDetailsForm user={user} />
                </section>

                {/* Logout */}
                <section
                    className={activeTab === "logout" ? "block" : "hidden"}
                    aria-hidden={activeTab !== "logout"}>
                    <h3 className="mb-5 text-2xl font-semibold">Logout</h3>
                    <p className="text-gray-700 mb-4">Click the button below to log out of your account.</p>
                    <div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 text-white rounded">
                            Log out
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}

function AccountDetailsForm({ user }) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Update local store after successful save
    const setUserState = (newUser) => {
        try {
            useUserStore.setState({ user: newUser });
        } catch (err) {
            // ignore
        }
    };

    const startEdit = () => {
        setName(user?.name || "");
        setEmail(user?.email || "");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setEditing(true);
    };

    const cancelEdit = () => setEditing(false);

    const saveChanges = async () => {
        if (newPassword) {
            if (!currentPassword) {
                toast.error("Enter your current password to change your password");
                return;
            }
            if (newPassword !== confirmPassword) {
                toast.error("New password and confirmation do not match");
                return;
            }
        }

        const payload = { name, email };
        if (newPassword) {
            payload.currentPassword = currentPassword;
            payload.newPassword = newPassword;
        }

        try {
            const res = await axios.put("/auth/profile", payload);
            const updatedUser = res.data;
            setUserState(updatedUser);
            toast.success("Profile updated successfully");
            setEditing(false);
        } catch (err) {
            const msg = err?.response?.data?.message || "Could not update profile";
            toast.error(msg);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            {!editing ? (
                <div className="space-y-4">
                    <div>
                        <div className="text-sm font-medium text-gray-700">Full name</div>
                        <div className="mt-1 text-gray-900">{user?.name || "-"}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-700">Email address</div>
                        <div className="mt-1 text-gray-900">{user?.email || "-"}</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={startEdit}
                            className="px-4 py-2 bg-[#00BBA6] text-white rounded">
                            Edit
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full border border-gray-200 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email address</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full border border-gray-200 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Current password (required to change)</label>
                        <input
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            type="password"
                            className="mt-1 block w-full border border-gray-200 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New password</label>
                        <input
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            type="password"
                            className="mt-1 block w-full border border-gray-200 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm new password</label>
                        <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            className="mt-1 block w-full border border-gray-200 rounded-md p-2"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={saveChanges}
                            type="button"
                            className="px-4 py-2 bg-[#00BBA6] text-white rounded">
                            Save changes
                        </button>
                        <button
                            onClick={cancelEdit}
                            type="button"
                            className="px-4 py-2 border rounded">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
