import React, { useEffect } from "react";
import { useBrandStore } from "../stores/useBrandStore";
import { Link } from "react-router-dom";

export default function BrandLogo() {
    const { stores, fetchAllStores, loading } = useBrandStore();

    useEffect(() => {
        fetchAllStores();
    }, [fetchAllStores]);

    const logos = stores && stores.length > 0 ? stores : [];

    return (
        <section className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-items-center">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="w-full aspect-square bg-gray-100 rounded-2xl animate-pulse" />
                    ))
                ) : logos.length > 0 ? (
                    logos.map((s) => (
                        <Link
                            key={s._id}
                            to={`/brand/${s._id}`}
                            className="group w-full flex flex-col items-center bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                            {s.logo_image ? (
                                <img
                                    src={s.logo_image}
                                    alt={s.name}
                                    className="h-32 w-32 object-contain mb-4 grayscale group-hover:grayscale-0 transition-all"
                                />
                            ) : (
                                <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xl mb-4 uppercase">
                                    {s.name.charAt(0)}
                                </div>
                            )}
                            <h4 className="text-lg font-bold text-gray-800 group-hover:text-emerald-600">{s.name}</h4>
                            <p className="text-sm text-gray-500 mt-1 text-center line-clamp-2">{s.description}</p>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl w-full">
                        <p className="text-gray-500 text-lg">No brands found.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
