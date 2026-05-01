import React from "react";
import Header from "../components/Header"; // Assuming these exist
import Footer from "../components/Footer"; // Assuming these exist
import AboutContent from "../components/AboutContent";
import CounterUp from "../components/CounterUp";
import ProgressBar from "../components/ProgressBar";
import BrandLogo from "../components/BrandLogo";
import { ChevronRight, Home } from "lucide-react";

export default function About() {
    return (
        <div className="font-sans text-gray-600">
            <Header />

            {/* --- Breadcrumbs Area --- */}
            <div className="bg-gray-100 py-5 border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <ul className="flex items-center gap-2 text-sm font-medium uppercase text-gray-500">
                        <li>
                            <a
                                href="/"
                                className="flex items-center hover:text-[#00bba6] transition-colors">
                                <Home size={14} className="mr-1" /> Home
                            </a>
                        </li>
                        <li>
                            <ChevronRight size={14} />
                        </li>
                        <li className="text-[#00bba6]">About Us</li>
                    </ul>
                </div>
            </div>
            {/* --- End Breadcrumbs --- */}

            {/* Page Components */}
            <div className="space-y-20 py-16">
                <AboutContent />
                {/* <CounterUp /> */}
                <ProgressBar />
                <BrandLogo />
            </div>

            <Footer />
        </div>
    );
}
