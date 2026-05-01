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
                <NewProducts />
                <FeaturedProducts />
                <BrandLogo />
            </main>
            <Footer />
        </>
    );
}
