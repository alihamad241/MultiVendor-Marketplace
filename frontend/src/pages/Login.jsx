import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { Loader } from "lucide-react"; 
import Breadcrumbs from "../components/Breadcrumbs";

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);

    // --- State for Login Form ---
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // --- State for Register Form ---
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
    });

    // --- Backend Store ---
    const { login, signup, loading } = useUserStore();

    // --- Handlers ---
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        login(loginEmail, loginPassword);
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        signup(registerData);
    };
    return (
        <>
            <Header />
            <Breadcrumbs items={[{ label: isLogin ? "Login" : "Register" }]} />

            <div className="bg-gray-50 py-12 border-b">
                <div className="mx-auto px-4 max-w-4xl text-center">
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                        {isLogin ? "Welcome Back" : "Join ShopSphere"}
                    </h1>
                    <p className="mt-3 text-gray-500 max-w-md mx-auto font-medium">
                        {isLogin 
                            ? "Log in to access your curated marketplace and track your latest orders." 
                            : "Create an account to start your journey with the world's most premium brands."}
                    </p>
                </div>
            </div>

            <div className="customer_login py-16 bg-white">
                <div className="mx-auto px-4">
                    <div className="max-w-md mx-auto">
                        {isLogin ? (
                            <div className="account_form animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">Login</h2>
                                <form onSubmit={handleLoginSubmit} className="space-y-4">
                                    <p>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            Username or email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            required
                                        />
                                    </p>
                                    <p>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            required
                                        />
                                    </p>
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-[0.98]"
                                        >
                                            {loading ? (
                                                <div className="flex items-center justify-center">
                                                    <Loader className="animate-spin h-5 w-5 mr-2" />
                                                    Authenticating...
                                                </div>
                                            ) : (
                                                "LOGIN"
                                            )}
                                        </button>
                                    </div>
                                </form>
                                <p className="mt-8 text-center text-gray-500">
                                    Don't have an account?{" "}
                                    <button onClick={() => setIsLogin(false)} className="text-emerald-600 font-bold hover:underline">Register here</button>
                                </p>
                            </div>
                        ) : (
                            <div className="account_form animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">Register</h2>
                                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                    <p>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                            value={registerData.name}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    name: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </p>
                                    <p>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            Email address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                            value={registerData.email}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    email: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </p>
                                    <p>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                            value={registerData.password}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    password: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </p>
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-[0.98]"
                                        >
                                            {loading ? (
                                                <div className="flex items-center justify-center">
                                                    <Loader className="animate-spin h-5 w-5 mr-2" />
                                                    Creating Account...
                                                </div>
                                            ) : (
                                                "CREATE ACCOUNT"
                                            )}
                                        </button>
                                    </div>
                                </form>
                                <p className="mt-8 text-center text-gray-500">
                                    Already have an account?{" "}
                                    <button onClick={() => setIsLogin(true)} className="text-emerald-600 font-bold hover:underline">Login here</button>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};
export default Login;
