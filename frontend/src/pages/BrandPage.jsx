import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useBrandStore } from "../stores/useBrandStore";
import { Loader } from "lucide-react";

const BrandPage = () => {
    const { id } = useParams();
    const { fetchStoreById } = useBrandStore();
    const [storeData, setStoreData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBrandData = async () => {
            setLoading(true);
            const data = await fetchStoreById(id);
            setStoreData(data);
            setLoading(false);
        };
        getBrandData();
    }, [id, fetchStoreById]);

    if (loading) {
        return (
            <>
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader className="animate-spin h-12 w-12 text-emerald-500" />
                </div>
                <Footer />
            </>
        );
    }

    if (!storeData || !storeData.store) {
        return (
            <>
                <Header />
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold">Brand not found</h2>
                    <a href="/" className="text-emerald-600 underline">Back to home</a>
                </div>
                <Footer />
            </>
        );
    }

    const { store, products } = storeData;

    return (
        <>
            <Header />
            <div className="brand_banner bg-gray-100 py-16">
                <div className="mx-auto px-4 max-w-6xl">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <img 
                            src={store.logo_image || "/assets/img/logo/logo.png"} 
                            alt={store.name} 
                            className="w-48 h-48 object-contain bg-white p-4 rounded-full shadow-md"
                        />
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold text-gray-800">{store.name}</h1>
                            <p className="mt-4 text-lg text-gray-600 max-w-2xl">
                                {store.description || "No description available for this brand."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="brand_products py-16">
                <div className="mx-auto px-4 max-w-6xl">
                    <h2 className="text-2xl font-bold mb-8 border-b pb-4">Our Products</h2>
                    {products && products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((p) => (
                                <ProductCard
                                    key={p._id}
                                    product={p}
                                    href={`/product/${p._id}`}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-500 text-lg">This brand hasn't added any products yet.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default BrandPage;
