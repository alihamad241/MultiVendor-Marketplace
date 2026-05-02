import { BarChart, PlusCircle, ShoppingBasket, Wallet, Package, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useProductStore } from "../stores/useProductStore";
import { useBrandStore } from "../stores/useBrandStore";
import { useOrdersStore } from "../stores/useOrdersStore";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

const tabs = [
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBasket },
    { id: "wallet", label: "Wallet", icon: Wallet },
];

const VendorDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("inventory");
    const { user } = useUserStore();
    const { fetchVendorProducts, createProduct, updateProduct, deleteProduct, products, loading: productLoading } = useProductStore();
    const { fetchMyStore, myStore, loading: storeLoading } = useBrandStore();
    const { fetchVendorOrders, updateOrderStatus, orders, loading: orderLoading } = useOrdersStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);

    const [productForm, setProductForm] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        gender: "",
        sizes: "",
        stock: "",
    });

    useEffect(() => {
        const loadData = async () => {
            const store = await fetchMyStore();
            if (store) {
                fetchVendorProducts(store.name);
                fetchVendorOrders();
            } else if (store === null) {
                // If user doesn't have a store at all, send them to register
                navigate("/register-brand");
            }
        };
        loadData();
    }, []); // Only fetch on mount

    const handleProductFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setProductForm({ ...productForm, image: reader.result });
        reader.readAsDataURL(file);
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateProduct(editingProductId, { ...productForm });
                toast.success("Product updated");
            } else {
                await createProduct({ ...productForm, storeName: myStore.name });
                toast.success("Product created");
            }
            setIsEditing(false);
            setEditingProductId(null);
            setProductForm({ name: "", description: "", price: "", image: "", category: "", gender: "", sizes: "", stock: "" });
            fetchVendorProducts(myStore.name);
        } catch (err) {
            toast.error(isEditing ? "Error updating product" : "Error creating product");
        }
    };

    const handleEditClick = (p) => {
        setIsEditing(true);
        setEditingProductId(p._id);
        setProductForm({
            name: p.name,
            description: p.description,
            price: p.price,
            image: p.image,
            category: p.category,
            gender: p.gender || "",
            sizes: p.sizes?.join(", ") || "",
            stock: p.stock || 0,
        });
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm("Delete this product?")) return;
        await deleteProduct(id);
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        await updateOrderStatus(orderId, newStatus);
    };

    return (
        <>
            <Header />
            <div className="shop_area py-12 bg-gray-50 min-h-screen">
                <div className="mx-auto px-4 max-w-7xl">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="p-8 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
                            <div className="flex items-center gap-6">
                                {myStore?.logo_image && (
                                    <img src={myStore.logo_image} alt={myStore.name} className="w-20 h-20 rounded-xl object-cover border-2 border-white/20" />
                                )}
                                <div>
                                    <h1 className="text-3xl font-bold">{myStore?.name || "Vendor Dashboard"}</h1>
                                    <p className="text-emerald-50 opacity-90">{myStore?.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex border-b border-gray-200 bg-gray-50/50">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-8 py-5 text-sm font-medium transition-all relative ${
                                        activeTab === tab.id ? "text-emerald-600 bg-white" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
                                    )}
                                </button>
                            ))}
                        </div>

                                <div className="p-8">
                            {myStore?.status === "pending" && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-amber-900 leading-tight text-lg uppercase tracking-tighter">Approval Pending</h4>
                                        <p className="text-amber-700 text-sm">Your store application is being reviewed by our administrators. You will be able to manage inventory and add products once your store is approved.</p>
                                    </div>
                                </motion.div>
                            )}
                            
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {activeTab === "inventory" && (
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div className={`lg:col-span-1 bg-gray-50 p-6 rounded-2xl border border-gray-200 ${myStore?.status === "pending" ? "opacity-50 pointer-events-none grayscale" : ""}`}>
                                                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                                    <PlusCircle className="w-5 h-5 text-emerald-600" />
                                                    {isEditing ? "Edit Product" : "Add New Product"}
                                                </h3>
                                                <form onSubmit={handleProductSubmit} className="space-y-4">
                                                    <input
                                                        value={productForm.name}
                                                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                                        placeholder="Product Name"
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                                                        required
                                                    />
                                                    <div className="flex gap-4">
                                                        <input
                                                            value={productForm.price}
                                                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                                            placeholder="Price ($)"
                                                            type="number"
                                                            className="w-1/2 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                                                            required
                                                        />
                                                        <input
                                                            value={productForm.stock}
                                                            onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                                                            placeholder="Stock"
                                                            type="number"
                                                            className="w-1/2 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <select
                                                            value={productForm.gender}
                                                            onChange={(e) => setProductForm({ ...productForm, gender: e.target.value })}
                                                            className="w-1/2 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                                                            required
                                                        >
                                                            <option value="">Gender</option>
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                            <option value="unisex">Unisex</option>
                                                        </select>
                                                        <input
                                                            value={productForm.category}
                                                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                                            placeholder="Category"
                                                            className="w-1/2 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                                                            required
                                                        />
                                                    </div>
                                                    <input
                                                        value={productForm.sizes}
                                                        onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                                                        placeholder="Sizes (e.g. S, M, L)"
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                                                    />
                                                    <textarea
                                                        value={productForm.description}
                                                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                                        placeholder="Product Description"
                                                        rows="4"
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                                                        required
                                                    />
                                                    <div>
                                                        <label className="block text-sm text-gray-500 mb-2">Product Image</label>
                                                        <input type="file" accept="image/*" onChange={handleProductFile} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                                                        {productForm.image && <img src={productForm.image} className="mt-4 w-32 h-32 object-cover rounded-lg border shadow-sm" />}
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <button type="submit" className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                                                            {isEditing ? "Update Product" : "Publish Product"}
                                                        </button>
                                                        {isEditing && (
                                                            <button 
                                                                type="button"
                                                                onClick={() => {
                                                                    setIsEditing(false);
                                                                    setEditingProductId(null);
                                                                    setProductForm({ name: "", description: "", price: "", image: "", category: "", gender: "", sizes: "", stock: "" });
                                                                }}
                                                                className="px-6 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </form>
                                            </div>

                                            <div className="lg:col-span-2">
                                                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                                    <Package className="w-5 h-5 text-emerald-600" />
                                                    My Products ({products?.length || 0})
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {products?.map((p) => (
                                                        <div key={p._id} className="bg-white border border-gray-200 p-4 rounded-2xl flex gap-4 hover:shadow-md transition-shadow">
                                                            <img src={p.image} className="w-24 h-24 object-cover rounded-lg" />
                                                            <div className="flex-1">
                                                                 <div className="flex justify-between items-start">
                                                                    <h4 className="font-bold text-gray-900 truncate max-w-[120px]">{p.name}</h4>
                                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${p.stock > 0 ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                                                                        {p.stock > 0 ? `Stock: ${p.stock}` : "Out of Stock"}
                                                                    </span>
                                                                 </div>
                                                                <p className="text-emerald-600 font-bold">${p.price}</p>
                                                                 <p className="text-xs text-gray-400">{p.category}</p>
                                                                 <div className="flex gap-4 mt-3">
                                                                    <button onClick={() => handleEditClick(p)} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                                                        <BarChart className="w-3 h-3" /> Edit
                                                                    </button>
                                                                    <button onClick={() => handleDeleteProduct(p._id)} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                                                                        Delete
                                                                    </button>
                                                                 </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "orders" && (
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                                <ShoppingBasket className="w-5 h-5 text-emerald-600" />
                                                Store Orders
                                            </h3>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                                                            <th className="px-6 py-4 font-medium">Order ID</th>
                                                            <th className="px-6 py-4 font-medium">Customer</th>
                                                            <th className="px-6 py-4 font-medium">Amount</th>
                                                            <th className="px-6 py-4 font-medium">Status</th>
                                                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {orders?.map((order) => (
                                                            <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                                                <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order._id.slice(-8)}</td>
                                                                <td className="px-6 py-4">
                                                                    <div className="text-sm font-medium text-gray-900">{order.user?.name}</div>
                                                                    <div className="text-xs text-gray-500">{order.user?.email}</div>
                                                                </td>
                                                                <td className="px-6 py-4 font-bold text-gray-900">${order.totalAmount}</td>
                                                                <td className="px-6 py-4">
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                                                        order.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                                                                        order.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                                                                    }`}>
                                                                        {order.status}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <select 
                                                                        className="text-sm border rounded-lg p-1 outline-none focus:ring-2 focus:ring-emerald-500"
                                                                        value={order.status}
                                                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                                    >
                                                                        <option value="pending">Pending</option>
                                                                        <option value="preparing">Preparing</option>
                                                                        <option value="out_for_delivery">Out for Delivery</option>
                                                                        <option value="completed">Completed</option>
                                                                        <option value="cancelled">Cancelled</option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "wallet" && (
                                        <div className="max-w-md mx-auto py-12 text-center">
                                            <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Wallet className="w-12 h-12 text-emerald-600" />
                                            </div>
                                            <h3 className="text-gray-500 font-medium mb-2 uppercase tracking-widest text-sm">Available Balance</h3>
                                            <div className="text-5xl font-black text-gray-900 mb-8 tracking-tight">
                                                ${user?.walletBalance?.toFixed(2) || "0.00"}
                                            </div>
                                            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 mb-8">
                                                <p className="text-emerald-700 text-sm">
                                                    Earnings are automatically added to your wallet once an order is marked as <strong>Completed</strong>.
                                                </p>
                                            </div>
                                            <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                                                Request Payout
                                            </button>
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

export default VendorDashboard;
