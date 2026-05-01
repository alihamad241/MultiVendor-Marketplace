import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-[#00BBA6] text-gray-700">
            <div className="mx-auto px-4 max-w-7xl py-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                <div className="max-w-sm text-sm">
                    <h4 className="font-semibold mb-2">About DEPI</h4>
                    <p className="text-sm">DEPI is a curated marketplace for unique products — quality, sustainability, and design.</p>
                </div>

                <div className="text-sm">
                    <h4 className="font-semibold mb-2">Contact</h4>
                    <div className="space-y-1">
                        <a
                            href="mailto:contact@depi.com"
                            className="block text-gray-700 hover:underline">
                            contact@depi.com
                        </a>
                        <a
                            href="tel:+1012234432568"
                            className="block text-gray-700 hover:underline">
                            (+01) 222 344 32568
                        </a>
                        <div className="text-xs text-gray-600 mt-1">19 Interpro Road Madison, AL 35758, USA</div>
                    </div>
                </div>

                <div className="text-sm">
                    <h4 className="font-semibold mb-2">Pages</h4>
                    <ul className="space-y-1">
                        <li>
                            <Link
                                to="/about"
                                className="text-gray-700 hover:underline">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/faq"
                                className="text-gray-700 hover:underline">
                                FAQ
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="text-sm">
                    <h4 className="font-semibold mb-2">Follow us</h4>
                    <div className="flex gap-3">
                        <a
                            href="#"
                            aria-label="Facebook"
                            className="text-gray-700 hover:text-gray-900">
                            <i className="fa fa-facebook"></i>
                        </a>
                        <a
                            href="#"
                            aria-label="Twitter"
                            className="text-gray-700 hover:text-gray-900">
                            <i className="fa fa-twitter"></i>
                        </a>
                        <a
                            href="#"
                            aria-label="Instagram"
                            className="text-gray-700 hover:text-gray-900">
                            <i className="fa fa-instagram"></i>
                        </a>
                        <a
                            href="#"
                            aria-label="LinkedIn"
                            className="text-gray-700 hover:text-gray-900">
                            <i className="fa fa-linkedin"></i>
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200/40">
                <div className="mx-auto px-4 max-w-7xl py-3 text-center text-sm text-gray-600">
                    © {new Date().getFullYear()} DEPI. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
