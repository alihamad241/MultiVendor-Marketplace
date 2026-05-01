import React from "react";
import { Link } from "react-router-dom";

export default function AboutContent() {
    return (
        <section className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-10">
                {/* Left: Image */}
                <div className="w-full lg:w-1/2">
                    <div className="overflow-hidden rounded-sm">
                        <img
                            src="https://audaces.com/wp-content/uploads/2023/09/how-to-start-an-online-store.webp"
                            alt="About Us"
                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>

                {/* Right: Content */}
                <div className="w-full lg:w-1/2">
                    <div className="space-y-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 uppercase leading-tight">
                            Connecting You To <br /> Global Style
                        </h1>
                        <p className="text-gray-500 leading-relaxed">
                            Welcome to the ultimate fashion destination where
                            diversity meets design. We are more than just a
                            store; we are a thriving marketplace connecting
                            fashion-forward individuals with top-tier
                            independent vendors and established brands. Our
                            mission is to democratize style by giving you access
                            to unique pieces, sustainable fabrics, and modern
                            cuts from creators around the world. We handle the
                            platform, so you can focus on expressing your unique
                            identity.
                        </p>
                        <div className="pt-2">
                            <Link
                                to="/"
                                className="inline-block bg-white text-black border border-black text-sm font-bold uppercase tracking-wider px-8 py-3 rounded-sm hover:bg-[#00bba6] transition-colors duration-300">
                                Home Page
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
