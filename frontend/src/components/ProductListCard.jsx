import React from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { useProductStore } from "../stores/useProductStore";
import { Heart, Star, Trash } from "lucide-react";

export default function ProductListCard({ product }) {
    const { addToCart, addToWishlist, removeFromWishlist, wishlist = [] } = useCartStore();
    const { user } = useUserStore();
    const { deleteProduct, toggleFeaturedProduct } = useProductStore();

    if (!product) return null;

    const { _id, name, title, description, price, image, gender, category, inStock = true } = product;

    const displayTitle = name || title || "Untitled";

    const inWishlist = !!wishlist.find((p) => p._id === _id);

    return (
        <div className="product_list_item mb-6 bg-white rounded shadow-sm overflow-hidden flex flex-wrap items-center">
            <div className="w-full md:w-1/3 lg:w-1/4 p-4">
                <Link to={`/product/${_id}`}>
                    <img
                        src={image || "/assets/img/product/product-default.jpg"}
                        alt={displayTitle}
                        className="w-full h-40 object-cover rounded"
                    />
                </Link>
            </div>

            <div className="w-full md:w-2/3 lg:w-3/4 p-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold">
                            <Link
                                to={`/product/${_id}`}
                                className="text-gray-800 hover:text-blue-600">
                                {displayTitle}
                            </Link>
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">{description || "No description available."}</p>

                        <div className="mt-3 text-sm text-gray-700 space-x-4">
                            <span className="font-medium">Category:</span>
                            <span>{category || "—"}</span>
                            <span className="mx-2">•</span>
                            <span className="font-medium">Gender:</span>
                            <span>{gender || "Unisex"}</span>
                        </div>
                    </div>

                    <div className="ml-4 text-right w-40 shrink-0">
                        <div className="text-xl font-bold text-gray-900">{price ? `$${price.toFixed(2)}` : "—"}</div>
                        <div className="mt-3 space-y-2">
                            <button
                                onClick={() => addToCart(_id)}
                                className="w-full bg-[#00BBA6] text-white px-3 py-2 rounded font-semibold hover:bg-black transition-colors duration-200">
                                Add to cart
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (inWishlist) removeFromWishlist(_id);
                                    else addToWishlist(product);
                                }}
                                title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                                className="w-full bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2">
                                <Heart className={`w-4 h-4 ${inWishlist ? "text-pink-500" : "text-gray-400"}`} />
                                {inWishlist ? "In wishlist" : "Add to wishlist"}
                            </button>

                            {user && user.role === "admin" && (
                                <div className="mt-2 flex items-center justify-between gap-2">
                                    <button
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            await toggleFeaturedProduct(_id);
                                        }}
                                        title="Toggle featured"
                                        className="flex-1 bg-white border border-gray-200 px-3 py-2 rounded flex items-center justify-center gap-2">
                                        <Star className={`w-4 h-4 ${product.isFeatured ? "text-yellow-400" : "text-gray-300"}`} />
                                        <span className="text-sm">{product.isFeatured ? "Featured" : "Feature"}</span>
                                    </button>
                                    <button
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            if (!confirm("Delete this product?")) return;
                                            await deleteProduct(_id);
                                        }}
                                        title="Delete product"
                                        className="w-12 bg-white border border-gray-200 px-2 py-2 rounded flex items-center justify-center">
                                        <Trash className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
