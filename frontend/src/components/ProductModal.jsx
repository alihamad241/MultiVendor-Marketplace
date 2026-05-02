import React, { useState, useEffect } from "react";
import { useCartStore } from "../stores/useCartStore";
import { toast } from "react-hot-toast";

export default function ProductModal({ isOpen = false, onClose = null, product = null }) {
    const { addToCart } = useCartStore();
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (product) {
            setSelectedSize(product.sizes?.[0] || null);
            setQuantity(1);
        }
    }, [product]);

    if (!isOpen) return null;

    const title = product?.name || "Product";
    const img = product?.image || "/assets/img/product/product13.jpg";
    const price = product?.price ? `$${product.price}` : "";
    const isOutOfStock = product?.stock === 0;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        if (!product || !product._id) return;
        
        if (product.sizes?.length > 0 && !selectedSize) {
            toast.error("Please select a size first");
            return;
        }

        try {
            await addToCart(product, selectedSize);
            onClose && onClose();
        } catch (error) {
            // Error handled in store
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => onClose && onClose()}
            />
            <div className="relative bg-white rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                    onClick={() => onClose && onClose()}
                    aria-label="Close">
                    <i className="fa fa-times text-xl"></i>
                </button>
                
                <div className="flex flex-wrap h-full max-h-[90vh] overflow-y-auto">
                    <div className="w-full lg:w-5/12 bg-gray-50 flex items-center justify-center p-8">
                        <div className="relative group w-full aspect-square">
                            <img
                                src={img}
                                alt={title}
                                className="w-full h-full object-cover rounded-xl shadow-lg"
                            />
                            {isOutOfStock && (
                                <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-xl">
                                    <span className="bg-red-600 text-white font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">Sold Out</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="w-full lg:w-7/12 p-8 lg:p-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isOutOfStock ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                                    {isOutOfStock ? "Out of Stock" : "In Stock"}
                                </span>
                                {product?.category && <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">{product.category}</span>}
                            </div>
                            
                            <h2 className="text-3xl font-black text-gray-900 leading-tight">{title}</h2>
                            
                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl font-black text-emerald-600">{price}</span>
                                {product?.stock < 10 && product?.stock > 0 && (
                                    <span className="text-sm font-bold text-orange-500 animate-pulse">Low stock: Only {product.stock} left!</span>
                                )}
                            </div>
                            
                            <div className="text-gray-600 leading-relaxed line-clamp-3">
                                {product?.description || "Experience premium quality with this exquisite marketplace find."}
                            </div>
                            
                            {product?.sizes?.length > 0 && (
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider">Select Size</label>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setSelectedSize(s)}
                                                className={`px-6 py-3 border-2 rounded-xl font-bold transition-all duration-200 ${
                                                    selectedSize === s
                                                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-100"
                                                        : "border-gray-100 text-gray-400 hover:border-gray-200"
                                                }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex flex-wrap items-center gap-6 pt-4">
                                <div className="flex items-center border-2 border-gray-100 rounded-xl bg-gray-50 overflow-hidden">
                                    <button 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-2 hover:bg-gray-200 transition-colors"
                                    >
                                        <i className="fa fa-minus text-xs"></i>
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-12 bg-transparent text-center font-bold focus:outline-none"
                                    />
                                    <button 
                                        onClick={() => setQuantity(Math.min(product?.stock || 100, quantity + 1))}
                                        className="px-4 py-2 hover:bg-gray-200 transition-colors"
                                    >
                                        <i className="fa fa-plus text-xs"></i>
                                    </button>
                                </div>
                                
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isOutOfStock || (product?.sizes?.length > 0 && !selectedSize)}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-200 disabled:shadow-none flex items-center justify-center gap-3">
                                    <i className="fa fa-shopping-cart"></i>
                                    {isOutOfStock ? "Sold Out" : "Add to Cart"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
