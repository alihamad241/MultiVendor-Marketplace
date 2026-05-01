import { useCartStore } from "../stores/useCartStore";
import WishlistItem from "../components/WishlistItem";
import Social from "../components/Social";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

import React, { useEffect } from "react";

const WishlistPage = () => {
    const { wishlist, loadWishlist } = useCartStore();

    useEffect(() => {
        loadWishlist();
    }, [loadWishlist]);

    return (
        <>
            <Header />
            <div className="breadcrumbs_area">
                <div className="flex flex-wrap -mx-4">
                    <div className="w-full">
                        <div className="breadcrumb_content">
                            <ul>
                                <li>
                                    <a href="/">home</a>
                                </li>
                                <li>
                                    <i className="fa fa-angle-right"></i>
                                </li>
                                <li>Wishlist</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-8 md:py-16">
                <div className="grid grid-cols-1 justify-items-center w-full max-w-7xl mx-auto gap-8">
                    {wishlist.length === 0 ? (
                        <EmptyWishlistUI />
                    ) : (
                        <>
                            {/* Wishlist table */}
                            <div className="w-full overflow-x-auto">
                                <table className="w-full text-center border border-gray-200 border-collapse">
                                    <thead className="text-[#5B5B5B] border-b-4 border-b-[#00BBA6]">
                                        <tr>
                                            <th className="py-3">DELETE</th>
                                            <th className="py-3">IMAGE</th>
                                            <th className="py-3">PRODUCT</th>
                                            <th className="py-3">PRICE</th>
                                            <th className="py-3">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {wishlist.map((item) => (
                                            <WishlistItem
                                                key={item._id}
                                                item={item}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Social share section */}
                            <div className="w-full">
                                <Social />
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default WishlistPage;

// Empty wishlist UI
const EmptyWishlistUI = () => (
    <motion.div
        className="flex flex-col items-center justify-center space-y-4 py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <ShoppingCart className="h-24 w-24 text-gray-300" />
        <h3 className="text-2xl font-semibold">Your wishlist is empty</h3>
        <p className="text-gray-400">You haven’t added anything to your wishlist yet.</p>
        <Link
            className="mt-4 rounded-md bg-[#00BBA6] px-6 py-2 text-white hover:bg-black transition-colors duration-200"
            to="/">
            Browse Products
        </Link>
    </motion.div>
);
