import React, { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import ProductCard from "./ProductCard";

export default function RelatedProducts({ currentProduct = null }) {
    const { products, fetchAllProducts, loading } = useProductStore();

    useEffect(() => {
        if (!products || !products.length) fetchAllProducts();
    }, [products, fetchAllProducts]);

    const list = (products || []).filter((p) => (currentProduct ? p._id !== currentProduct._id : true)).slice(0, 6);

    return (
        <div className="new_product_area product_page py-8">
            <div className="mx-auto px-4">
                <div className="flex flex-wrap -mx-4">
                    <div className="w-full">
                        <div className="block_title">
                            <h3 className="text-2xl font-bold">Related Products</h3>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap -mx-4">
                    <div className="single_p_active w-full flex gap-4 overflow-x-auto py-4">
                        {loading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                  <div
                                      key={i}
                                      className="lg:w-1/4 w-full px-4 mb-6 shrink-0">
                                      <div className="single_product bg-white rounded shadow-sm overflow-hidden h-56" />
                                  </div>
                              ))
                            : list.map((p) => (
                                  <div
                                      key={p._id}
                                      className="lg:w-1/4 w-full px-4 mb-6 shrink-0">
                                      <ProductCard product={p} />
                                  </div>
                              ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
