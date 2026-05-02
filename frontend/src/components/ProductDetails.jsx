import React, { useState, useEffect } from "react";
import { useCartStore } from "../stores/useCartStore";
import { toast } from "react-hot-toast";

export default function ProductDetails({ product, loading }) {
    const addToCart = useCartStore((s) => s.addToCart);
    const addToWishlist = useCartStore((s) => s.addToWishlist);

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

    useEffect(() => {
        // reset local selections when product changes
        setQuantity(1);
        setSelectedSize(product?.sizes?.[0] ?? null);
        setSelectedColor(product?.colors?.[0] ?? null);
    }, [product]);

    const displayName = product?.name || "Product";
    const description = product?.description || "No description available.";
    const price = product?.price != null ? `$${Number(product.price).toFixed(2)}` : "";

    const handleAddToCart = async () => {
        if (!product || !product._id) return;
        if (product.sizes?.length > 0 && !selectedSize) {
            toast.error("Please select a size first");
            return;
        }
        
        try {
            for (let i = 0; i < Math.max(1, Number(quantity)); i++) {
                await addToCart(product, selectedSize);
            }
        } catch (e) {
            // error handled in store
        }
    };

    const handleAddToWishlist = () => {
        if (!product || !product._id) return;
        addToWishlist(product);
    };

    if (loading && !product) {
        return (
            <div className="w-full md:w-1/2 lg:w-6/12 px-4">
                <div className="space-y-3 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-40 bg-gray-100 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
            </div>
        );
    }

    const isOutOfStock = product?.stock === 0;

    return (
        <div className="w-full md:w-1/2 lg:w-6/12 px-4">
            <div className="product_d_right space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{displayName}</h1>
                    <div className="flex items-center gap-4">
                        <div className="product_ratting">
                            <ul className="flex gap-1 text-yellow-400">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <li key={i}>
                                        <i className="fa fa-star"></i>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {product?.stock != null && (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${isOutOfStock ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                                {isOutOfStock ? "Out of Stock" : "In Stock"}
                            </span>
                        )}
                    </div>
                </div>

                <div className="product_desc text-gray-600 leading-relaxed">
                    <p>{description}</p>
                </div>

                <div className="flex items-baseline gap-4">
                    <span className="text-3xl font-black text-emerald-600">{price}</span>
                    {product?.category && <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">{product.category}</span>}
                </div>

                {product?.sizes?.length > 0 && (
                    <div className="product_d_size">
                        <label className="block text-sm font-bold text-gray-700 uppercase mb-3">
                            Select Size
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {product.sizes.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setSelectedSize(s)}
                                    className={`px-4 py-2 border-2 transition-all duration-200 font-medium rounded-lg ${
                                        selectedSize === s
                                            ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                                            : "border-gray-200 text-gray-600 hover:border-gray-300"
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
                            min="1"
                            max={product?.stock || 100}
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                            type="number"
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
                        type="button"
                        onClick={handleAddToCart}
                        disabled={!product?._id || isOutOfStock || (product?.sizes?.length > 0 && !selectedSize)}
                        className="flex-1 lg:flex-none bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-emerald-200 disabled:shadow-none flex items-center justify-center gap-3">
                        <i className="fa fa-shopping-cart"></i> 
                        {isOutOfStock ? "Sold Out" : "Add to Cart"}
                    </button>

                    <button
                        type="button"
                        onClick={handleAddToWishlist}
                        className="p-4 border-2 border-gray-100 rounded-xl hover:border-emerald-600 hover:text-emerald-600 transition-all text-gray-400">
                        <i className="fa fa-heart text-xl"></i>
                    </button>
                </div>

                {product?.stock != null && product.stock > 0 && product.stock < 10 && (
                    <p className="text-orange-500 text-sm font-medium animate-pulse">
                        <i className="fa fa-warning mr-2"></i> Only {product.stock} left in stock - order soon!
                    </p>
                )}

                <div className="wishlist-share mt-2">
                    <h4 className="font-semibold">Share on:</h4>
                    <ul className="flex gap-3 mt-2 text-gray-600">
                        <li>
                            <a href="#">
                                <i className="fa fa-rss"></i>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fa fa-vimeo"></i>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fa fa-tumblr"></i>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fa fa-pinterest"></i>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fa fa-linkedin"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
