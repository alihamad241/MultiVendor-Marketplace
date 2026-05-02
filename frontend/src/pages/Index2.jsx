import React from "react";
import Header from "../components/Header";
import HeroSlider from "../components/HeroSlider";
import NewProducts from "../components/NewProducts";
import FeaturedProducts from "../components/FeaturedProducts";
import BrandLogo from "../components/BrandLogo";
import Footer from "../components/Footer";

export default function Index2() {
    return (
        <>
            <Header />
            <main>
                <HeroSlider />
                <div className="py-12 bg-white">
                    <div className="container mx-auto px-4 text-center mb-12">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Discover Top Brands</h2>
                        <p className="text-xl text-gray-600">Shop directly from your favorite labels and creators.</p>
                    </div>
                    <BrandLogo />
                </div>
            </main>
            <Footer />
        </>
    );
}
