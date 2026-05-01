import { Router, Routes, Route } from "react-router-dom";
import Index2 from "./pages/Index2.jsx";
import About from "./pages/About.jsx";
import SingleProduct from "./pages/SingleProduct.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import CartPage from "./pages/CartPage.jsx";
import Contact from "./pages/Contact.jsx";
import Faq from "./pages/Faq.jsx";
import MyAccount from "./pages/MyAccount.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import ShopList from "./pages/ShopList.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import PurchaseSuccess from "./pages/PurchaseSuccess.jsx";

import { Toaster } from "react-hot-toast";

import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartStore";
import { useEffect } from "react";
import React from "react";
import { Navigate } from "react-router-dom";

function RedirectToBackendSuccess() {
    // Vite exposes env vars via import.meta.env. Use VITE_BACKEND_URL if provided.
    const backend = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_SERVER_URL || window.location.origin;
    React.useEffect(() => {
        const qs = window.location.search || '';
        // Redirect the browser to the backend success page which will finalize the order.
        window.location.href = `${backend.replace(/\/$/, '')}/purchase-success${qs}`;
    }, []);
    return null;
}

function App() {
    const { user, checkAuth, checkingAuth } = useUserStore();
    const { getCartItems } = useCartStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (!user) return;

        getCartItems();
    }, [getCartItems, user]);

    // if (checkingAuth) {
    //     return <div>Loading...</div>;
    // }

    return (
        <div>
            <div>
                <Routes>
                    <Route
                        path="/"
                        element={user ? <Index2 /> : <Login />}
                    />
                    <Route
                        path="/about"
                        element={<About />}
                    />
                    <Route
                        path="/product/:id"
                        element={user ? <SingleProduct /> : <Login />}
                    />
                    <Route
                        path="/cart"
                        element={user ? <CartPage /> : <Login />}
                    />
                    <Route
                        path="/contact"
                        element={<Contact />}
                    />
                    <Route
                        path="/faq"
                        element={<Faq />}
                    />
                    <Route
                        path="/my-account"
                        element={user ? <MyAccount /> : <Login />}
                    />
                    <Route
                        path="/orders/:id"
                        element={user ? <OrderDetails /> : <Login />}
                    />
                    <Route
                        path="/shop"
                        element={user ? <ShopPage /> : <Login />}
                    />
                    <Route
                        path="/shop/list"
                        element={user ? <ShopList /> : <Login />}
                    />
                    <Route
                        path="/wishlist"
                        element={user ? <WishlistPage /> : <Login />}
                    />
                    <Route
                        path="/login"
                        element={<Login />}
                    />
                    <Route
                        path="/purchase-success"
                        element={import.meta.env.PROD ? <RedirectToBackendSuccess /> : <PurchaseSuccess />}
                    />
                    <Route
                        path="/admin"
                        element={user?.role === "admin" ? <AdminPage /> : <Login />}
                    />
                    <Route
                        path="/404"
                        element={<NotFound />}
                    />
                    <Route
                        path="*"
                        element={<NotFound />}
                    />
                </Routes>
            </div>
            <Toaster />
        </div>
    );
}

export default App;
