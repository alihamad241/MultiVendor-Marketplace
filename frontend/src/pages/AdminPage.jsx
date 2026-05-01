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
    { id: "create", label: "Create Product", icon: PlusCircle },
    { id: "analytics", label: "Analytics", icon: BarChart },
    { id: "coupons", label: "Coupons", icon: ShoppingBasket },
];

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("create");
    const { fetchAllProducts, createProduct, loading } = useProductStore();
    const { fetchAllStores, createStore, deleteStore, stores, loading: storesLoading } = useBrandStore();
    const { fetchCoupons, createCoupon, deleteCoupon, adminCoupons, adminLoading, adminError } = useCouponStore();

    const [productForm, setProductForm] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        gender: "",
        storeName: "",
    });

    const [storeForm, setStoreForm] = useState({ name: "", description: "", image: "" });
    const [message, setMessage] = useState("");
    const [couponForm, setCouponForm] = useState({ code: "", discountPercentage: 10, isActive: true, expirationDate: "" });

    useEffect(() => {
        fetchAllProducts();
        fetchAllStores();
    }, [fetchAllProducts, fetchAllStores]);

    // fetch coupons once on mount (admin)
    useEffect(() => {
        fetchCoupons();
    }, []);

    const fileToDataUrl = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const handleProductFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const dataUrl = await fileToDataUrl(file);
            setProductForm((s) => ({ ...s, image: dataUrl }));
        } catch (err) {
            console.error("File read error", err);
            toast.error("Unable to read image file");
        }
    };

    const handleStoreFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const dataUrl = await fileToDataUrl(file);
            setStoreForm((s) => ({ ...s, image: dataUrl }));
        } catch (err) {
            console.error("File read error", err);
            toast.error("Unable to read image file");
        }
    };
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            // use central product store to create product
            await createProduct(productForm);
            toast.success("Product created");
            setProductForm({ name: "", description: "", price: "", image: "", category: "", gender: "", storeName: "" });
            // refresh products list
            fetchAllProducts();
        } catch (err) {
            console.error(err);
            // normalize error to a string to avoid React rendering objects
            const errMsg = err?.response?.data?.message || err?.response?.data || err?.message || "Error creating product";
            toast.error(typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg));
        }
    };

    const handleStoreSubmit = async (e) => {
        e.preventDefault();
        try {
            await createStore(storeForm);
            toast.success("Store created");
            setStoreForm({ name: "", description: "", image: "" });
            await fetchAllStores();
        } catch (err) {
            console.error(err);
            const errMsg = err?.response?.data?.message || err?.response?.data || err?.message || "Error creating store";
            toast.error(typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg));
        }
    };

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
            // errors handled in store, but also log full response here for debugging
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

            <div className="breadcrumbs_area">
                <div className="mx-auto px-4">
                    <div className="breadcrumb_content">
                        <ul>
                            <li>
                                <a href="/">home</a>
                            </li>
                            <li>
                                <i className="fa fa-angle-right"></i>
                            </li>
                            <li>Admin</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="shop_area py-12">
                <div className="mx-auto px-4">
                    <div className="pos_page_inner">
                        <div className="flex flex-wrap -mx-4">
                            <div className="w-full px-4">
                                <motion.h1
                                    className="text-3xl font-bold mb-6 text-emerald-600 tracking-tight"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}>
                                    Admin Dashboard
                                </motion.h1>

                                <div className="mb-6 bg-white rounded shadow-sm p-4">
                                    <div className="flex justify-center mb-4">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`relative flex items-center justify-center px-4 py-2 mx-1 rounded-md transition-colors duration-200 ${
                                                    activeTab === tab.id ? "bg-emerald-600 text-white" : "text-gray-700 hover:bg-emerald-50"
                                                }`}>
                                                <tab.icon className="mr-2 h-5 w-5" />
                                                <span>{tab.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeTab}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}>
                                            {activeTab === "create" && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="p-6 bg-white rounded">
                                                        <h3 className="text-lg font-semibold mb-3">Create Product</h3>
                                                        {message && <div className="mb-3 text-sm text-emerald-600">{message}</div>}
                                                        <form
                                                            onSubmit={handleProductSubmit}
                                                            className="space-y-3">
                                                            <input
                                                                value={productForm.name}
                                                                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                                                placeholder="Name"
                                                                className="w-full border px-3 py-2 rounded"
                                                            />
                                                            <input
                                                                value={productForm.price}
                                                                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                                                placeholder="Price"
                                                                className="w-full border px-3 py-2 rounded"
                                                            />
                                                            <div>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={handleProductFile}
                                                                    className="w-full"
                                                                />
                                                                {productForm.image && (
                                                                    <div className="mt-2">
                                                                        <img
                                                                            src={productForm.image}
                                                                            alt="product preview"
                                                                            className="w-24 h-24 object-cover rounded"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <input
                                                                value={productForm.storeName}
                                                                onChange={(e) => setProductForm({ ...productForm, storeName: e.target.value })}
                                                                placeholder="Brand / Store name"
                                                                className="w-full border px-3 py-2 rounded"
                                                            />
                                                            <input
                                                                value={productForm.gender}
                                                                onChange={(e) => setProductForm({ ...productForm, gender: e.target.value })}
                                                                placeholder="Gender"
                                                                className="w-full border px-3 py-2 rounded"
                                                            />
                                                            <input
                                                                value={productForm.category}
                                                                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                                                placeholder="Category"
                                                                className="w-full border px-3 py-2 rounded"
                                                            />
                                                            <textarea
                                                                value={productForm.description}
                                                                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                                                placeholder="Short description"
                                                                className="w-full border px-3 py-2 rounded"
                                                            />
                                                            <div className="flex justify-end">
                                                                <button
                                                                    type="submit"
                                                                    disabled={loading}
                                                                    className={`bg-emerald-600 text-white px-4 py-2 rounded ${
                                                                        loading ? "opacity-60 cursor-not-allowed" : ""
                                                                    }`}>
                                                                    Create Product
                                                                </button>
                                                            </div>
                                                        </form>

                                                        <div className="mt-6">
                                                            <h4 className="text-md font-semibold mb-3">Existing Stores</h4>
                                                            {storesLoading ? (
                                                                <div className="text-sm text-gray-600">Loading stores...</div>
                                                            ) : stores && stores.length > 0 ? (
                                                                <ul className="space-y-3">
                                                                    {stores.map((s) => (
                                                                        <li
                                                                            key={s._id}
                                                                            className="flex items-center justify-between bg-gray-50 border rounded px-3 py-2">
                                                                            <div className="flex items-center gap-3">
                                                                                {s.logo_image ? (
                                                                                    <img
                                                                                        src={s.logo_image}
                                                                                        alt={s.name}
                                                                                        className="w-12 h-12 object-cover rounded"
                                                                                    />
                                                                                ) : (
                                                                                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">
                                                                                        No
                                                                                    </div>
                                                                                )}
                                                                                <div>
                                                                                    <div className="font-medium text-gray-800">{s.name}</div>
                                                                                    <div className="text-sm text-gray-600">{s.description}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <button
                                                                                    onClick={() => handleDeleteStore(s._id)}
                                                                                    className="text-sm text-red-600 hover:underline">
                                                                                    Delete
                                                                                </button>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <div className="text-sm text-gray-600">No stores found.</div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="p-6 bg-white rounded">
                                                        <h3 className="text-lg font-semibold mb-3">Create Store / Brand</h3>
                                                        <form
                                                            onSubmit={handleStoreSubmit}
                                                            className="space-y-3">
                                                            <input
                                                                value={storeForm.name}
                                                                onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                                                                placeholder="Store name"
                                                                className="w-full border px-3 py-2 rounded"
                                                            />
                                                            <div>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={handleStoreFile}
                                                                    className="w-full"
                                                                />
                                                                {storeForm.image && (
                                                                    <div className="mt-2">
                                                                        <img
                                                                            src={storeForm.image}
                                                                            alt="store preview"
                                                                            className="w-24 h-24 object-cover rounded"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <textarea
                                                                value={storeForm.description}
                                                                onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
                                                                placeholder="Short description"
                                                                className="w-full border px-3 py-2 rounded"
                                                            />
                                                            <div className="flex justify-end">
                                                                <button
                                                                    type="submit"
                                                                    disabled={storesLoading}
                                                                    className={`bg-emerald-600 text-white px-4 py-2 rounded ${
                                                                        storesLoading ? "opacity-60 cursor-not-allowed" : ""
                                                                    }`}>
                                                                    Create Store
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            )}
                                            {activeTab === "analytics" && <AnalyticsTab />}
                                            {activeTab === "coupons" && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="p-6 bg-white rounded">
                                                        <h3 className="text-lg font-semibold mb-3">Create Coupon</h3>
                                                        <form
                                                            onSubmit={handleCreateCoupon}
                                                            className="space-y-3">
                                                            <input
                                                                value={couponForm.code}
                                                                onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                                                                placeholder="Coupon Code"
                                                                className="w-full border px-3 py-2 rounded"
                                                            />
                                                            <input
                                                                value={couponForm.discountPercentage}
                                                                onChange={(e) =>
                                                                    setCouponForm({ ...couponForm, discountPercentage: Number(e.target.value) })
                                                                }
                                                                placeholder="Discount Percentage"
                                                                type="number"
                                                                min={0}
                                                                max={100}
                                                                className="w-full border px-3 py-2 rounded"
                                                            />
                                                            <input
                                                                value={couponForm.expirationDate}
                                                                onChange={(e) => setCouponForm({ ...couponForm, expirationDate: e.target.value })}
                                                                placeholder="Expiration Date"
                                                                type="date"
                                                                className="w-full border px-3 py-2 rounded"
                                                            />
                                                            <div className="flex justify-end">
                                                                <button
                                                                    type="submit"
                                                                    className="bg-emerald-600 text-white px-4 py-2 rounded">
                                                                    Create Coupon
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>

                                                    <div className="p-6 bg-white rounded">
                                                        <h3 className="text-lg font-semibold mb-3">Existing Coupons</h3>
                                                        {adminLoading ? (
                                                            <div className="text-sm text-gray-600">Loading coupons...</div>
                                                        ) : adminError ? (
                                                            <div className="text-sm text-red-600">{adminError}</div>
                                                        ) : adminCoupons.length === 0 ? (
                                                            <div className="text-sm text-gray-600">No coupons found.</div>
                                                        ) : (
                                                            <ul className="space-y-2">
                                                                {adminCoupons.map((c) => (
                                                                    <li
                                                                        key={c._id}
                                                                        className="flex items-center justify-between border p-2 rounded">
                                                                        <div>
                                                                            <div className="font-medium">
                                                                                {c.code} — {c.discountPercentage}%
                                                                            </div>
                                                                            <div className="text-sm text-gray-500">
                                                                                Expires: {new Date(c.expirationDate).toLocaleDateString()}
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            {c.isActive ? (
                                                                                <button
                                                                                    onClick={() => handleDeactivateCoupon(c.code)}
                                                                                    className="text-sm text-red-600">
                                                                                    Deactivate
                                                                                </button>
                                                                            ) : (
                                                                                <span className="text-sm text-gray-500">Inactive</span>
                                                                            )}
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
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
                </div>
            </div>

            <Footer />
        </>
    );
};
export default AdminPage;
