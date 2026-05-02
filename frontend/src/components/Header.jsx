import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useProductStore } from "../stores/useProductStore";
import toast from "react-hot-toast";

export default function Header() {
    const [selectedLang, setSelectedLang] = useState("en");
    const [langOpen, setLangOpen] = useState(false);
    const [currencyOpen, setCurrencyOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState("usd");
    const langRef = useRef(null);
    const currencyRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (langRef.current && !langRef.current.contains(e.target)) {
                setLangOpen(false);
            }
            if (
                currencyRef.current &&
                !currencyRef.current.contains(e.target)
            ) {
                setCurrencyOpen(false);
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const { user, checkingAuth, checkAuth, logout } = useUserStore();
    const navigate = useNavigate();
    const location = useLocation();

    const { cart, subtotal, total, getCartItems } = useCartStore();
    const itemCount = (cart || []).reduce(
        (sum, it) => sum + (it.quantity || 0),
        0
    );

    const { products, fetchAllProducts, searchProductsAndStores } = useProductStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState({ products: [], stores: [] });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length > 1) {
                setIsSearching(true);
                const results = await searchProductsAndStores(searchQuery);
                setSearchResults(results);
                setIsSearching(false);
            } else {
                setSearchResults({ products: [], stores: [] });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, searchProductsAndStores]);

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        const q = (searchQuery || "").trim();
        if (!q) {
            navigate("/shop");
            return;
        }

        // Use the searchResults if available, or just navigate to shop with query
        if (searchResults.products.length > 0) {
            navigate(`/product/${searchResults.products[0]._id}`);
        } else if (searchResults.stores.length > 0) {
            navigate(`/brand/${searchResults.stores[0]._id}`);
        } else {
            navigate(`/shop?q=${encodeURIComponent(q)}`);
        }
        setShowSuggestions(false);
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
        navigate("/");
    };

    useEffect(() => {
        if (checkingAuth) checkAuth();
    }, []);

    useEffect(() => {
        getCartItems();
    }, [getCartItems]);

    return (
        <header>
            <div className="bg-white">
                <div className="header_top">
                    <div className="mx-auto px-4">
                        <div className="flex flex-wrap items-center">
                            <div className="lg:w-1/2 w-full px-4">
                            </div>
                            <div className="lg:w-1/2 w-full px-4">
                                <div className="header_links text-right">
                                    <ul>
                                        <li>
                                            <Link to="/wishlist" title="wishlist">
                                                My wishlist
                                            </Link>
                                        </li>
                                        {user && (user.role === "vendor" || user.role === "admin") && (
                                            <li>
                                                <Link to="/vendor-dashboard" title="Vendor Dashboard">
                                                    Vendor Dashboard
                                                </Link>
                                            </li>
                                        )}
                                        <li>
                                            <Link to="/register-brand" title="Become a Seller">
                                                Become a Seller
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/my-account" title="My account">
                                                My account
                                            </Link>
                                        </li>
                                        {user && user.role === "admin" && (
                                            <li>
                                                <Link to="/admin" title="Admin Dashboard">
                                                    Admin
                                                </Link>
                                            </li>
                                        )}
                                        <li>
                                            {user ? (
                                                <a href="#" onClick={handleLogout} title="Logout">
                                                    Logout
                                                </a>
                                            ) : (
                                                <Link to="/login" title="Login">
                                                    Login
                                                </Link>
                                            )}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="header_middel hidden lg:block border-b border-gray-100">
                    <div className="mx-auto px-4">
                        <div className="flex flex-wrap items-center py-8">
                            <div className="lg:w-1/4">
                                <div className="logo">
                                    <Link to="/">
                                        <img src="/assets/img/logo/logo.jpg.png" alt="ShopSphere" className="h-20 object-contain" />
                                    </Link>
                                </div>
                            </div>
                            <div className="lg:w-1/2">
                                <div className="modern_search_bar relative">
                                    <form onSubmit={handleSearchSubmit} className="flex">
                                        <input
                                            placeholder="Search products or brands..."
                                            type="text"
                                            autoComplete="off"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onFocus={() => setShowSuggestions(true)}
                                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                            className="border-2 border-emerald-600/20 px-5 py-3 w-full rounded-l-2xl outline-none focus:border-emerald-600 transition-colors"
                                        />
                                        <button type="submit" className="bg-emerald-600 text-white px-8 py-3 rounded-r-2xl font-bold hover:bg-emerald-700 transition-colors">
                                            <i className="fa fa-search"></i>
                                        </button>
                                    </form>

                                    {showSuggestions && (searchResults.products.length > 0 || searchResults.stores.length > 0) && (
                                        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[450px] overflow-y-auto">
                                            {searchResults.stores.length > 0 && (
                                                <div className="p-3 border-b border-gray-50 bg-emerald-50/30">
                                                    <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-3 mb-2">Top Brands</h4>
                                                    <div className="grid grid-cols-1 gap-1">
                                                        {searchResults.stores.map((s) => (
                                                            <button
                                                                key={s._id}
                                                                onClick={() => navigate(`/brand/${s._id}`)}
                                                                className="flex items-center gap-4 w-full p-3 hover:bg-white rounded-xl transition-all text-left group"
                                                            >
                                                                <img src={s.logo_image} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                                                                <span className="text-sm font-bold text-gray-800 group-hover:text-emerald-600">{s.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {searchResults.products.length > 0 && (
                                                <div className="p-3">
                                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-2">Products</h4>
                                                    <div className="grid grid-cols-1 gap-1">
                                                        {searchResults.products.map((p) => (
                                                            <button
                                                                key={p._id}
                                                                onClick={() => navigate(`/product/${p._id}`)}
                                                                className="flex items-center gap-4 w-full p-3 hover:bg-gray-50 rounded-xl transition-all text-left"
                                                            >
                                                                <img src={p.image} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-bold text-gray-800">{p.name}</span>
                                                                    <span className="text-xs text-emerald-600 font-black">${p.price}</span>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="lg:w-1/4 flex justify-end gap-12 items-center">
                                <Link to="/wishlist" className="relative text-gray-700 hover:text-emerald-600 transition-all duration-300 group flex items-center justify-center">
                                    <i className="fa fa-heart-o" style={{ fontSize: '42px', lineHeight: '1' }}></i>
                                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-600 rounded-full scale-0 group-hover:scale-100 transition-transform"></span>
                                </Link>
                                <Link to="/cart" className="relative text-gray-700 hover:text-emerald-600 transition-all duration-300 group flex items-center justify-center">
                                    <i className="fa fa-shopping-cart" style={{ fontSize: '42px', lineHeight: '1' }}></i>
                                    {cart?.length > 0 && (
                                        <span className="absolute -top-3 -right-5 bg-emerald-600 text-white text-xs w-7 h-7 rounded-full flex items-center justify-center font-black shadow-xl shadow-emerald-200 ring-4 ring-white">
                                            {cart.length}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile menu toggle for small screens */}
                <div className="lg:hidden px-4 py-3 border-t border-gray-200/20">
                    <div className="mx-auto max-w-7xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link to="/">
                                <img src="/assets/img/logo/logo.jpg.png" alt="ShopSphere" className="w-40" />
                            </Link>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                aria-expanded={mobileMenuOpen}
                                aria-label="Toggle menu"
                                onClick={() => setMobileMenuOpen((v) => !v)}
                                className="p-2 rounded bg-black/10"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <nav className="mt-3 bg-white rounded shadow-sm p-3">
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 text-gray-800">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 text-gray-800">
                                        Shop
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 text-gray-800">
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 text-gray-800">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 text-gray-800">
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/my-account" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 text-gray-800">
                                        My Account
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 text-gray-800">
                                        Cart
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>

                <div className="header_bottom">
                    <div className="mx-auto px-4">
                        <div className="flex flex-wrap -mx-4">
                            <div className="w-full">
                                <div className="main_menu_inner">
                                    <div className="main_menu hidden lg:block">
                                        <nav>
                                            <ul className="flex items-center">
                                                <li className={location.pathname === "/" ? "active" : ""}>
                                                    <Link to="/" className="text-white text-lg px-6 py-2">
                                                        HOME
                                                    </Link>
                                                </li>
                                                <li className={location.pathname === "/shop" ? "active" : ""}>
                                                    <Link to="/shop" className="text-white text-lg px-6 py-2">
                                                        SHOP
                                                    </Link>
                                                </li>
                                                <li className={location.pathname === "/about" ? "active" : ""}>
                                                    <Link to="/about" className="text-white text-lg px-6 py-2">
                                                        ABOUT US
                                                    </Link>
                                                </li>
                                                <li className={location.pathname === "/faq" ? "active" : ""}>
                                                    <Link to="/faq" className="text-white text-lg px-6 py-2">
                                                        FAQ
                                                    </Link>
                                                </li>
                                                <li className={location.pathname === "/contact" ? "active" : ""}>
                                                    <Link to="/contact" className="text-white text-lg px-6 py-2">
                                                        CONTACT US
                                                    </Link>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
