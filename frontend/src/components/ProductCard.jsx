import React from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { Trash, Star, Heart } from "lucide-react";

export default function ProductCard({
    product = null,
    image,
    title,
    price,
    href = "/product",
    badge,
    variant = "grid",
    onViewDetail,
}) {
    // support both flat props and product object
    const prod = product || { image, title, price };
    const productId = prod._id;
    const hrefTo = productId ? `/product/${productId}` : href || "/product";
    const displayTitle = prod.name || prod.title || title;

    const { deleteProduct, toggleFeaturedProduct } = useProductStore();
    const {
        addToCart,
        addToWishlist,
        removeFromWishlist,
        wishlist = [],
    } = useCartStore();
    const { user } = useUserStore();

    const handleAddToCart = async (e) => {
        e.preventDefault();
        if (!prod || !productId) return; // need id to add
        await addToCart({ _id: productId });
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!productId) return;
        if (!confirm("Delete this product?")) return;
        await deleteProduct(productId);
    };

    const handleToggleFeatured = async (e) => {
        e.preventDefault();
        if (!productId) return;
        await toggleFeaturedProduct(productId);
    };
    const cardShadow = {
        boxShadow: "0 6px 12px rgba(0,0,0,0.08), 0 -6px 10px rgba(0,0,0,0.04)",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
    };

    if (variant === "list") {
        return (
            <div
                style={cardShadow}
                className="product_list_item mb-6 bg-white rounded-xl shadow-sm overflow-hidden flex flex-wrap">
                <div className="w-full md:w-1/3 lg:w-1/4 relative">
                    <Link
                        to={hrefTo}
                        state={{ product: prod }}
                        className="block">
                        <img
                            src={prod.image}
                            alt={displayTitle}
                            className="w-full h-40 object-cover"
                        />
                    </Link>
                    {badge && (
                        <div className="absolute top-2 left-2 w-8 h-8 overflow-hidden">
                            <img
                                src={badge}
                                alt="badge"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    )}
                </div>
                <div className="w-full md:w-2/3 lg:w-3/4 p-4">
                    <h3 className="text-lg font-semibold">
                        <Link
                            to={hrefTo}
                            state={{ product: prod }}
                            className="text-gray-800 hover:text-blue-600">
                            {displayTitle}
                        </Link>
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                        This is a short description for the product, matching
                        the list view structure.
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t pt-3">
                        <span className="text-lg font-bold text-gray-900">
                            {prod.price || price}
                        </span>
                        <a href="#" className="text-blue-600">
                            Add to cart
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // grid / default
    return (
        <div
            style={cardShadow}
            className="single_product group bg-white rounded-xl shadow-sm overflow-hidden relative">
            <div className="product_thumb relative overflow-hidden">
                <Link to={hrefTo} state={{ product: prod }} className="block">
                    <img
                        src={prod.image}
                        alt={displayTitle}
                        className="w-full h-44 object-cover transform transition-transform duration-300 group-hover:scale-105"
                    />
                </Link>
                {badge && (
                    <div className="absolute top-2 left-2 w-9 h-9 overflow-hidden">
                        <img
                            src={badge}
                            alt="badge"
                            className="w-full h-full object-contain"
                        />
                    </div>
                )}
                {/* wishlist indicator (small heart) */}
                {productId && (
                    <div className="absolute top-2 right-2">
                        {(() => {
                            const inWishlist = !!wishlist.find(
                                (p) => p._id === productId
                            );
                            return (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (inWishlist)
                                            removeFromWishlist(productId);
                                        else addToWishlist(prod);
                                    }}
                                    title={
                                        inWishlist
                                            ? "Remove from wishlist"
                                            : "Add to wishlist"
                                    }
                                    className="bg-white p-1 rounded-full shadow">
                                    <Heart
                                        className={`w-5 h-5 ${
                                            inWishlist
                                                ? "text-pink-500"
                                                : "text-gray-300"
                                        }`}
                                    />
                                </button>
                            );
                        })()}
                    </div>
                )}
                <div className="product_action absolute inset-x-2 -bottom-10 group-hover:bottom-2 transition-all duration-300 flex justify-center space-x-2">
                    <button
                        onClick={handleAddToCart}
                        className="bg-white text-sm px-3 py-1 rounded shadow">
                        Add to cart
                    </button>
                    {user && user.role === "admin" && (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleToggleFeatured}
                                title="Toggle featured"
                                className="bg-white p-1 rounded shadow">
                                <Star className="w-4 h-4 text-yellow-500" />
                            </button>
                            <button
                                onClick={handleDelete}
                                title="Delete product"
                                className="bg-white p-1 rounded shadow">
                                <Trash className="w-4 h-4 text-red-500" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="product_content p-4">
                <span className="product_price text-lg font-semibold text-gray-900">
                    ${prod.price || price}
                </span>
                <h3 className="product_title mt-2 text-sm">
                    <Link
                        to={hrefTo}
                        state={{ product: prod }}
                        className="text-gray-800 hover:text-blue-600">
                        {displayTitle}
                    </Link>
                </h3>
            </div>
        </div>
    );
}
