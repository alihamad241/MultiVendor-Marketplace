import React, { useEffect } from "react";
import ProductCard from "./ProductCard";
import Carousel from "./Carousel";
import { useProductStore } from "../stores/useProductStore";

export default function FeaturedProducts() {
    const { featuredProducts: featured, fetchFeaturedProducts, loading } = useProductStore();

    useEffect(() => {
        fetchFeaturedProducts();
    }, [fetchFeaturedProducts]);

    return (
        <div className="new_product_area product_two py-12">
            <div className="mx-auto px-4">
                <div className="flex flex-wrap -mx-4">
                    <div className="w-full">
                        <div className="block_title">
                            <h3 className="text-2xl font-bold">featured Products</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <div className="mx-auto max-w-7xl px-0">
                    <div className="flex flex-wrap -mx-4">
                        <div className="w-full px-2">
                            <Carousel
                                className="py-4"
                                autoplay={false}>
                                {loading &&
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="px-2">
                                            <div className="bg-gray-100 w-full h-40 rounded" />
                                        </div>
                                    ))}

                                {!loading &&
                                    featured &&
                                    featured.length > 0 &&
                                    featured.map((p) => (
                                        <div
                                            key={p._id}
                                            className="px-2">
                                            <ProductCard
                                                product={p}
                                                href={`/product/${p._id}`}
                                            />
                                        </div>
                                    ))}
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
