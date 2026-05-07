import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Store, Info, MessageCircle, HelpCircle, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-gray-300 pt-16 pb-8 border-t border-white/5">
            <div className="mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                                <ShoppingBag className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter">
                                Shop<span className="text-emerald-500">Sphere</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed opacity-70">
                            The ultimate multi-vendor marketplace for quality products. Empowering independent brands and providing customers with a curated shopping experience.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-8 flex items-center gap-2">
                            <ShoppingBag size={18} className="text-emerald-500" />
                            Shop Now
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link to="/shop" className="hover:text-emerald-500 transition-colors flex items-center gap-2">
                                    Browse All Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop?category=Fashion" className="hover:text-emerald-500 transition-colors flex items-center gap-2">
                                    Fashion & Apparel
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop?category=Electronics" className="hover:text-emerald-500 transition-colors flex items-center gap-2">
                                    Electronics
                                </Link>
                            </li>
                            <li>
                                <Link to="/wishlist" className="hover:text-emerald-500 transition-colors flex items-center gap-2">
                                    My Wishlist
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Vendor Section */}
                    <div>
                        <h4 className="text-white font-bold mb-8 flex items-center gap-2">
                            <Store size={18} className="text-emerald-500" />
                            Sell on ShopSphere
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link to="/register-brand" className="hover:text-emerald-500 transition-colors">
                                    Become a Seller
                                </Link>
                            </li>
                            <li>
                                <Link to="/vendor-dashboard" className="hover:text-emerald-500 transition-colors">
                                    Vendor Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="hover:text-emerald-500 transition-colors">
                                    Seller Guidelines
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-emerald-500 transition-colors">
                                    Merchant Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support Section */}
                    <div>
                        <h4 className="text-white font-bold mb-8 flex items-center gap-2">
                            <MessageCircle size={18} className="text-emerald-500" />
                            Contact Us
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-emerald-500 shrink-0" />
                                <span>19 Interpro Road<br />Madison, AL 35758, USA</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-emerald-500 shrink-0" />
                                <a href="tel:+1012234432568" className="hover:text-emerald-500 transition-colors">(+01) 222 344 32568</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-emerald-500 shrink-0" />
                                <a href="mailto:support@shopsphere.com" className="hover:text-emerald-500 transition-colors">support@shopsphere.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <p className="opacity-50">
                        © {new Date().getFullYear()} ShopSphere. All rights reserved. Built with passion for excellence.
                    </p>
                    <div className="flex gap-8 opacity-50">
                        <Link to="/faq" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
                        <Link to="/faq" className="hover:opacity-100 transition-opacity">Terms of Service</Link>
                        <Link to="/faq" className="hover:opacity-100 transition-opacity">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
