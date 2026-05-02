import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import axios from "../libs/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AnalyticsTab from "../components/AnalyticsTab";
import { useProductStore } from "../stores/useProductStore";
import { useBrandStore } from "../stores/useBrandStore";
import { useCouponStore } from "../stores/useCouponStore";
import toast from "react-hot-toast";

const tabs = [
    { id: "stores", label: "Store Requests", icon: PlusCircle },
    { id: "analytics", label: "Analytics", icon: BarChart },
    { id: "coupons", label: "Coupons", icon: ShoppingBasket },
];

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("stores");
    const { fetchAllProducts, deleteProduct } = useProductStore();
    const { 
        fetchAllStores, 
        deleteStore, 
        stores, 
        pendingStores, 
        fetchPendingStores, 
        updateStoreStatus,
        loading: storesLoading 
    } = useBrandStore();
    const { fetchCoupons, createCoupon, deleteCoupon, adminCoupons, adminLoading, adminError } = useCouponStore();

    const [couponForm, setCouponForm] = useState({ code: "", discountPercentage: 10, isActive: true, expirationDate: "" });

    useEffect(() => {
        fetchAllStores();
        fetchPendingStores();
    }, [fetchAllStores, fetchPendingStores]);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleDeleteStore = async (id) => {
        if (!confirm("Delete this store?")) return;
        try {
            await deleteStore(id);
            toast.success("Store deleted");
            await fetchAllStores();
        } catch (err) {
            console.error(err);
            const errMsg = err?.response?.data?.message || err?.response?.data || err?.message || "Error deleting store";
            toast.error(typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg));
        }
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...couponForm };
            await createCoupon(payload);
            setCouponForm({ code: "", discountPercentage: 10, expirationDate: "" });
        } catch (err) {
            console.error("Admin create coupon error", err);
            const errMsg = err?.message || (typeof err === "string" ? err : JSON.stringify(err));
            toast.error(typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg));
        }
    };

    const handleDeactivateCoupon = async (code) => {
        if (!confirm("Deactivate this coupon?")) return;
        try {
            await deleteCoupon(code);
        } catch (err) {
            // errors already handled in store
        }
    };

    return (
        <>
            <Header />

            <div className="breadcrumbs_area py-8 bg-gray-50 border-b">
                <div className="mx-auto px-4 max-w-7xl">
                    <div className="breadcrumb_content">
                        <ul className="flex items-center gap-2 text-sm">
                            <li><a href="/" className="text-gray-500 hover:text-emerald-600 transition-colors">home</a></li>
                            <li><i className="fa fa-angle-right text-gray-300"></i></li>
                            <li className="font-bold text-gray-900 tracking-tight">Admin</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="admin_page_wrapper py-12 bg-white min-h-screen">
                <div className="mx-auto px-4 max-w-7xl">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">
                            Admin <span className="text-emerald-600">Dashboard</span>
                        </h1>
                        <p className="text-gray-500">Manage marketplace stores, coupons, and view system analytics.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Tabs */}
                        <div className="lg:col-span-1 space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                                        activeTab === tab.id 
                                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" 
                                            : "text-gray-500 hover:bg-gray-100"
                                    }`}
                                >
                                    <tab.icon className="h-5 w-5" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="lg:col-span-3">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-gray-50 rounded-3xl p-8 border border-gray-100"
                                >
                                    {activeTab === "stores" && (
                                        <div className="space-y-12">
                                            {/* Pending Requests */}
                                            <section>
                                                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                                    PENDING STORE REQUESTS ({pendingStores?.length || 0})
                                                </h3>
                                                
                                                {storesLoading ? (
                                                    <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>
                                                ) : pendingStores && pendingStores.length > 0 ? (
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {pendingStores.map((s) => (
                                                            <div key={s._id} className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-wrap items-center justify-between gap-6 hover:shadow-md transition-all">
                                                                <div className="flex items-center gap-4">
                                                                    <img src={s.logo_image} alt={s.name} className="w-16 h-16 object-cover rounded-xl shadow-sm border border-gray-100" />
                                                                    <div>
                                                                        <h4 className="font-bold text-gray-900 text-lg leading-tight">{s.name}</h4>
                                                                        <p className="text-sm text-gray-400 font-medium mb-1">{s.owner?.email || "Unknown Owner"}</p>
                                                                        <p className="text-xs text-gray-500 line-clamp-1 max-w-md">{s.description}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <button 
                                                                        onClick={() => updateStoreStatus(s._id, "approved")}
                                                                        className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors"
                                                                    >
                                                                        Approve
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => updateStoreStatus(s._id, "rejected")}
                                                                        className="px-6 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-200">
                                                        <PlusCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                                        <p className="text-gray-400 font-bold">No pending requests at the moment.</p>
                                                    </div>
                                                )}
                                            </section>

                                            <hr className="border-gray-200" />

                                            {/* Existing Stores */}
                                            <section>
                                                <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Existing Marketplace Stores</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {stores?.map((s) => (
                                                        <div key={s._id} className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center justify-between gap-4 group">
                                                            <div className="flex items-center gap-3">
                                                                <img src={s.logo_image} className="w-12 h-12 object-cover rounded-lg grayscale group-hover:grayscale-0 transition-all" />
                                                                <div>
                                                                    <h5 className="font-bold text-gray-800 leading-tight">{s.name}</h5>
                                                                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full font-black uppercase">Approved</span>
                                                                </div>
                                                            </div>
                                                            <button 
                                                                onClick={() => handleDeleteStore(s._id)}
                                                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        </div>
                                    )}

                                    {activeTab === "analytics" && <AnalyticsTab />}

                                    {activeTab === "coupons" && (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                                <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Create Coupon</h3>
                                                <form onSubmit={handleCreateCoupon} className="space-y-4">
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Code</label>
                                                        <input
                                                            value={couponForm.code}
                                                            onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                                                            placeholder="WINTER2024"
                                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Discount %</label>
                                                        <input
                                                            value={couponForm.discountPercentage}
                                                            onChange={(e) => setCouponForm({ ...couponForm, discountPercentage: Number(e.target.value) })}
                                                            type="number"
                                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Expiration Date</label>
                                                        <input
                                                            value={couponForm.expirationDate}
                                                            onChange={(e) => setCouponForm({ ...couponForm, expirationDate: e.target.value })}
                                                            type="date"
                                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold"
                                                            required
                                                        />
                                                    </div>
                                                    <button type="submit" className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-50 mt-4 hover:bg-emerald-700 transition-colors">
                                                        Create Coupon
                                                    </button>
                                                </form>
                                            </div>

                                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                                <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Active Coupons</h3>
                                                {adminLoading ? (
                                                    <div className="text-center py-8">Loading...</div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {adminCoupons.map((c) => (
                                                            <div key={c._id} className="p-4 rounded-2xl bg-gray-50 flex items-center justify-between border border-transparent hover:border-emerald-100 transition-all">
                                                                <div>
                                                                    <div className="font-black text-emerald-600">{c.code}</div>
                                                                    <div className="text-xs font-bold text-gray-400">{c.discountPercentage}% OFF</div>
                                                                </div>
                                                                <button onClick={() => handleDeactivateCoupon(c.code)} className="text-xs font-bold text-red-500 hover:underline">Deactivate</button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};
export default AdminPage;
