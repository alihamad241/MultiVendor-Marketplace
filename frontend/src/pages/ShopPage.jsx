import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useProductStore } from "../stores/useProductStore";
import { useMemo } from "react";

export default function ShopPage() {
    const { products, fetchAllProducts, fetchFilteredProducts, loading } = useProductStore();
    const [viewMode, setViewMode] = useState("grid");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedGender, setSelectedGender] = useState("");
    const [initialProducts, setInitialProducts] = useState([]);

    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);

    const [sortBy, setSortBy] = useState("default");
    const list = useMemo(() => {
        const arr = (products || []).slice();
        switch (sortBy) {
            case "name-asc":
                return arr.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
            case "name-desc":
                return arr.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
            default:
                return arr;
        }
    }, [products, sortBy]);
    const location = useLocation();
    const [page, setPage] = useState(1);
    const pageSize = 9;
    const totalPages = Math.max(1, Math.ceil((list || []).length / pageSize));
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(list.length, page * pageSize);
    const currentItems = list.slice(startIndex, endIndex);

    const categories = useMemo(() => {
        const set = new Set(initialProducts.map((p) => p.category || "").filter(Boolean));
        return ["", ...Array.from(set)];
    }, [initialProducts]);

    const genders = useMemo(() => {
        const set = new Set(initialProducts.map((p) => p.gender || "").filter(Boolean));
        // normalize genders to lowercase for matching
        const arr = Array.from(set).map((g) => (g || "").toLowerCase());
        return ["", ...arr];
    }, [initialProducts]);

    const applyFilters = async (category, gender) => {
        setSelectedCategory(category || "");
        setSelectedGender(gender || "");
        setPage(1);
        // send category as-is; backend will filter by exact match (case-insensitive)
        await fetchFilteredProducts({ category: category || undefined, gender: gender || undefined });
    };

    // capture initial full product list for building category/gender lists
    useEffect(() => {
        if ((!initialProducts || initialProducts.length === 0) && products && products.length > 0) {
            setInitialProducts(products);
        }
    }, [products, initialProducts]);

    function RouteViewToggle({ viewMode, setViewMode }) {
        const pathname = location.pathname;
        const gridActive = pathname === "/shop" || pathname === "/";
        const listActive = pathname === "/shop/list";

        return (
            <div className="inline-flex items-center gap-2">
                <Link
                    to="/shop"
                    onClick={() => setViewMode("grid")}
                    className={`px-2 py-1 border rounded ${gridActive ? "bg-gray-200" : ""}`}>
                    Grid
                </Link>
                <Link
                    to="/shop/list"
                    onClick={() => setViewMode("list")}
                    className={`px-2 py-1 border rounded ${listActive ? "bg-gray-200" : ""}`}>
                    List
                </Link>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="breadcrumbs_area">
                <div className="flex flex-wrap -mx-4">
                    <div className="w-full">
                        <div className="breadcrumb_content">
                            <ul>
                                <li>
                                    <a href="/">home</a>
                                </li>
                                <li>
                                    <i className="fa fa-angle-right"></i>
                                </li>
                                <li>Shop</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="shop_area">
                <div className="mx-auto px-4">
                    <div className="pos_page_inner">
                        <div className="flex flex-wrap -mx-4">
                            <div className="w-full lg:w-9/12 px-4">
                                <div className="shop_toolbar mb-6 flex items-center justify-between">
                                    <div className="showing_results">
                                        <p className="text-sm text-gray-600">
                                            Showing 1–{Math.min(9, list.length)} of {list.length} results
                                        </p>
                                    </div>
                                    <div className="shop_actions flex items-center gap-3">
                                        <label className="text-sm text-gray-600">Sort By:</label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="border rounded px-3 py-1">
                                            <option value="default">Default</option>
                                            <option value="name-asc">Product Name: A-Z</option>
                                            <option value="name-desc">Product Name: Z-A</option>
                                        </select>
                                        <div className="view_switch inline-flex items-center">
                                            <RouteViewToggle
                                                viewMode={viewMode}
                                                setViewMode={setViewMode}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="shop_products">
                                    {viewMode === "grid" ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {loading
                                                ? Array.from({ length: pageSize }).map((_, i) => (
                                                      <div
                                                          key={i}
                                                          className="bg-gray-100 h-56 rounded"
                                                      />
                                                  ))
                                                : currentItems.map((p) => (
                                                      <ProductCard
                                                          key={p._id}
                                                          product={p}
                                                          href={`/product/${p._id}`}
                                                          badge="/assets/img/cart/span-new.png"
                                                      />
                                                  ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {loading
                                                ? Array.from({ length: pageSize }).map((_, i) => (
                                                      <div
                                                          key={i}
                                                          className="bg-gray-100 h-36 rounded"
                                                      />
                                                  ))
                                                : currentItems.map((p) => (
                                                      <div
                                                          key={p._id}
                                                          className="bg-white rounded shadow-sm p-4">
                                                          <ProductCard
                                                              product={p}
                                                              href={`/product/${p._id}`}
                                                              badge="/assets/img/cart/span-new.png"
                                                          />
                                                      </div>
                                                  ))}
                                        </div>
                                    )}

                                    <div className="pagination mt-6 flex items-center justify-center">
                                        <nav>
                                            <ul className="inline-flex items-center gap-2">
                                                <li>
                                                    <button
                                                        onClick={() => setPage((s) => Math.max(1, s - 1))}
                                                        disabled={page === 1}
                                                        className="px-3 py-1 border rounded">
                                                        Prev
                                                    </button>
                                                </li>
                                                {Array.from({ length: totalPages }).map((_, idx) => {
                                                    const p = idx + 1;
                                                    return (
                                                        <li key={p}>
                                                            <button
                                                                onClick={() => setPage(p)}
                                                                className={`px-3 py-1 border rounded ${p === page ? "bg-gray-100" : ""}`}>
                                                                {p}
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                                <li>
                                                    <button
                                                        onClick={() => setPage((s) => Math.min(totalPages, s + 1))}
                                                        disabled={page === totalPages}
                                                        className="px-3 py-1 border rounded">
                                                        Next
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>

                            <aside className="w-full lg:w-3/12 px-4">
                                <div className="sidebar_widget mb-6 bg-white rounded shadow-sm p-4">
                                    <h3 className="font-semibold mb-3">Categories</h3>
                                    <ul className="text-sm text-gray-700 space-y-2">
                                        {categories.map((c) => (
                                            <li key={c || "all"}>
                                                <button
                                                    onClick={() => applyFilters(c || undefined, selectedGender || undefined)}
                                                    className={`text-left w-full ${
                                                        selectedCategory === c ? "font-semibold text-emerald-600" : "text-gray-700"
                                                    }`}>
                                                    {c === "" ? "All" : c}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="sidebar_widget mb-6 bg-white rounded shadow-sm p-4">
                                    <h3 className="font-semibold mb-3">Filter by Gender</h3>
                                    <div className="flex flex-col text-sm">
                                        {genders.map((g) => (
                                            <button
                                                key={g || "allg"}
                                                onClick={() => applyFilters(selectedCategory || undefined, g || undefined)}
                                                className={`text-left py-1 ${
                                                    selectedGender === g ? "font-semibold text-emerald-600" : "text-gray-700"
                                                }`}>
                                                {g === "" ? "All" : g.charAt(0).toUpperCase() + g.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Special Products removed as requested */}
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
