import React, { useState, useEffect } from "react";
import { useCartStore } from "../stores/useCartStore";

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
        // addToCart accepts product object or id; backend stores quantity server-side.
        // call it `quantity` times if quantity > 1 to keep compatibility with current API.
        try {
            for (let i = 0; i < Math.max(1, Number(quantity)); i++) {
                // call with product object so store can optimistically update
                // the cart and then refresh from server
                // await to avoid overwhelming server for large quantities
                // but keep it simple for small counts
                // eslint-disable-next-line no-await-in-loop
                await addToCart(product);
            }
        } catch (e) {
            // store will show a toast; keep UI silent here
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

    return (
        <div className="w-full md:w-1/2 lg:w-6/12 px-4">
            <div className="product_d_right space-y-4">
                <h1 className="text-2xl font-bold">{displayName}</h1>
                <div className="product_ratting mb-2">
                    <ul className="flex gap-1 text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <li key={i}>
                                <i className="fa fa-star"></i>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="product_desc text-gray-700">
                    <p>{description}</p>
                </div>

                <div className="content_price mb-2 text-xl">
                    <span className="font-semibold mr-3">{price}</span>
                    {product?.category && <small className="text-gray-500 ml-2">{product.category}</small>}
                </div>

                <div className="box_quantity mb-2 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm">quantity</label>
                        <input
                            min="1"
                            max="100"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                            type="number"
                            className="w-20 border rounded p-1"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={!product?._id}
                        className="bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded">
                        <i className="fa fa-shopping-cart mr-2"></i> add to cart
                    </button>

                    <button
                        type="button"
                        onClick={handleAddToWishlist}
                        title="add to wishlist"
                        className="text-gray-600">
                        <i
                            className="fa fa-heart"
                            aria-hidden="true"></i>
                    </button>
                </div>

                {product?.sizes?.length > 0 && (
                    <div className="product_d_size mb-2">
                        <label
                            htmlFor="size"
                            className="block text-sm mb-1">
                            size
                        </label>
                        <select
                            name="size"
                            id="size"
                            value={selectedSize || ""}
                            onChange={(e) => setSelectedSize(e.target.value)}
                            className="border rounded p-2 w-32">
                            {product.sizes.map((s) => (
                                <option
                                    key={s}
                                    value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {product?.colors?.length > 0 && (
                    <div className="sidebar_widget color">
                        <h2 className="text-lg font-semibold">Choose Color</h2>
                        <div className="widget_color mt-2">
                            <ul className="flex gap-2">
                                {product.colors.map((c) => (
                                    <li key={c}>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedColor(c)}
                                            aria-label={`Select color ${c}`}
                                            className={`w-6 h-6 rounded-full border-2 ${selectedColor === c ? "ring-2 ring-blue-400" : ""}`}
                                            style={{ background: c }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {product?.stock != null && (
                    <div className="product_stock mb-2 text-sm text-gray-600">
                        <p>{product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}</p>
                    </div>
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
