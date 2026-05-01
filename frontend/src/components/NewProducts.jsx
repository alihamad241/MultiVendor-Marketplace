import React, { useEffect, useRef, useLayoutEffect } from "react";
import ProductCard from "./ProductCard";
import Carousel from "./Carousel";
import { useProductStore } from "../stores/useProductStore";

export default function NewProducts() {
    const { products, fetchAllProducts, loading } = useProductStore();
    const containerRef = useRef(null);

    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);

    // show newest products by createdAt (descending). Be defensive for missing/invalid dates
    const newest = (products || [])
        .slice()
        .sort(
            (a, b) =>
                (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0)
        );

    // Equalize sizes: set minWidth/minHeight on all product cards to match the largest one
    useLayoutEffect(() => {
        if (loading) return; // wait until layout is stable
        const container = containerRef.current;
        if (!container) return;

        const elems = Array.from(container.querySelectorAll(".single_product"));
        if (!elems.length) return;

        // clear previous inline sizes
        elems.forEach((el) => {
            el.style.minHeight = "";
            el.style.minWidth = "";
        });

        // compute max dimensions
        const rects = elems.map((el) => el.getBoundingClientRect());
        const maxH = Math.max(...rects.map((r) => r.height));
        const maxW = Math.max(...rects.map((r) => r.width));

        // apply as min sizes so cards can still shrink on small screens
        elems.forEach((el) => {
            el.style.minHeight = `${Math.ceil(maxH)}px`;
            el.style.minWidth = `${Math.ceil(maxW)}px`;
            el.style.boxSizing = "border-box";
        });

        // recompute on resize (debounced via RAF)
        let raf = 0;
        const onResize = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                elems.forEach((el) => {
                    el.style.minHeight = "";
                    el.style.minWidth = "";
                });
                const rects2 = elems.map((el) => el.getBoundingClientRect());
                const maxH2 = Math.max(...rects2.map((r) => r.height));
                const maxW2 = Math.max(...rects2.map((r) => r.width));
                elems.forEach((el) => {
                    el.style.minHeight = `${Math.ceil(maxH2)}px`;
                    el.style.minWidth = `${Math.ceil(maxW2)}px`;
                });
            });
        };

        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
            cancelAnimationFrame(raf);
            // remove inline styles on cleanup
            elems.forEach((el) => {
                el.style.minHeight = "";
                el.style.minWidth = "";
            });
        };
    }, [loading, newest.length]);

    return (
        <div className="new_product_area product_two py-12">
            <div className="mx-auto px-4">
                <div className="flex flex-wrap -mx-4">
                    <div className="w-full">
                        <div className="block_title">
                            <h3 className="text-2xl font-bold">New Products</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <div className="mx-auto max-w-7xl px-0">
                    <div className="flex flex-wrap -mx-4">
                        <div className="w-full px-2">
                            <Carousel className="py-4" autoplay={false}>
                                {loading &&
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="px-2">
                                            <div className="bg-gray-100 w-full h-40 rounded" />
                                        </div>
                                    ))}

                                {!loading && newest.length > 0
                                    ? newest.map((p) => (
                                          <div key={p._id} className="px-2">
                                              <ProductCard
                                                  product={p}
                                                  href={`/product/${p._id}`}
                                              />
                                          </div>
                                      ))
                                    : // show a friendly skeleton-style placeholder when there are no new products
                                      Array.from({ length: 4 }).map((_, i) => (
                                          <div key={i} className="px-2">
                                              <div className="single_product bg-white rounded shadow-sm overflow-hidden p-4">
                                                  <div className="product_thumb mb-3">
                                                      <div className="w-full h-40 bg-gray-100 rounded animate-pulse" />
                                                  </div>
                                                  <div className="product_content">
                                                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
                                                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 animate-pulse" />
                                                      <div className="flex items-center justify-between">
                                                          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
                                                          <button className="bg-gray-300 text-white px-3 py-1 rounded opacity-60 cursor-not-allowed">
                                                              Add
                                                          </button>
                                                      </div>
                                                  </div>
                                              </div>
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
