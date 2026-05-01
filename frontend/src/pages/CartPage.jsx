import { Link } from "react-router-dom";
// import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import CartItem from "../components/CartItem";
import GiftCouponCard from "../components/GiftCouponCard";
import CartTotals from "../components/CartTotals";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { useCartStore } from "../stores/useCartStore";

const CartPage = () => {
    const { cart, getCartItems, calculateTotals } = useCartStore();

    useEffect(() => {
        getCartItems();
    }, [getCartItems]);
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
                                <li>Shopping Cart</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-8 md:py-16">
                <div className="mx-auto max-w-7xl px-4 2xl:px-0 space-y-8">
                    {cart?.length === 0 ? (
                        <EmptyCartUI />
                    ) : (
                        <>
                            {/* Full-width cart items table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-center border border-gray-200 border-collapse">
                                    <thead className="text-[#5B5B5B] border-b-4 border-b-[#00BBA6]">
                                        <tr>
                                            <th className="py-4">DELETE</th>
                                            <th className="py-4">IMAGE</th>
                                            <th className="py-4">PRODUCT</th>
                                            <th className="py-4">PRICE</th>
                                            <th className="py-4">QUANTITY</th>
                                            <th className="py-4">TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.map((item) => (
                                            <CartItem
                                                key={item._id}
                                                item={item}
                                            />
                                        ))}
                                    </tbody>
                                </table>

                                <div className="flex justify-end mt-4 w-full">
                                    <button
                                        onClick={() => calculateTotals()}
                                        className="px-6 py-2 hover:bg-[#00BBA6] text-white font-bold bg-black cursor-pointer transition-colors duration-200">
                                        UPDATE CART
                                    </button>
                                </div>
                            </div>

                            {/* Coupon + Totals */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-start">
                                <GiftCouponCard />
                                <CartTotals />
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CartPage;

// Empty cart UI
const EmptyCartUI = () => (
    <motion.div
        className="flex flex-col items-center justify-center space-y-4 py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <ShoppingCart className="h-24 w-24 text-gray-300" />
        <h3 className="text-2xl font-semibold">Your cart is empty</h3>
        <p className="text-gray-400">Looks like you haven't added anything to your cart yet.</p>
        <Link
            className="mt-4 rounded-md bg-[#00BBA6] px-6 py-2 text-white transition-colors hover:bg-black"
            to="/">
            Start Shopping
        </Link>
    </motion.div>
);
