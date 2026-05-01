import React, { useEffect } from "react";
import { useBrandStore } from "../stores/useBrandStore";

export default function BrandLogo() {
    const { stores, fetchAllStores, loading } = useBrandStore();

    useEffect(() => {
        fetchAllStores();
    }, [fetchAllStores]);

    const logos = stores && stores.length > 0 ? stores : [];

    return (
        <section className="container mx-auto px-4 py-10 border-t border-gray-100">
            <div className="text-center mb-8">
                <h3 className="text-xl font-bold uppercase text-gray-800 tracking-wider">Brands</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
                {loading ? (
                    // simple placeholders while loading
                    Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-full flex justify-center opacity-40 transition-opacity duration-300">
                            <div className="w-24 h-12 bg-gray-200 rounded" />
                        </div>
                    ))
                ) : logos.length > 0 ? (
                    logos.map((s) => (
                        <div
                            key={s._id}
                            className="w-full flex justify-center opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                            {s.logo_image ? (
                                <img
                                    src={s.logo_image}
                                    alt={s.name}
                                    className="max-h-20 w-auto"
                                />
                            ) : (
                                <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">{s.name}</div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-sm text-gray-600">No brands available</div>
                )}
            </div>
        </section>
    );
}
