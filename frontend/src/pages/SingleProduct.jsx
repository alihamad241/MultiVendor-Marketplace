import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductGallery from "../components/ProductGallery";
import ProductDetails from "../components/ProductDetails";
import ProductTabs from "../components/ProductTabs";
import RelatedProducts from "../components/RelatedProducts";
import ProductModal from "../components/ProductModal";
import { useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";

export default function SingleProduct() {
    const { id } = useParams();
    const { products, fetchAllProducts, fetchProductById, loading } = useProductStore();
    const location = useLocation();
    const initialFromState = location?.state?.product || null;
    const [product, setProduct] = useState(initialFromState);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            // if navigation provided a product in location.state, use it immediately (avoid unnecessary fetch)
            if (initialFromState && (!id || initialFromState._id === id)) {
                if (mounted) {
                    setProduct(initialFromState);
                    window.scrollTo(0, 0);
                }
                return;
            }

            // prefer to load single product by id
            if (id) {
                const p = await fetchProductById(id);
                if (mounted && p) {
                    setProduct(p);
                    window.scrollTo(0, 0);
                    return;
                }
            }

            // fallback: ensure all products are loaded and pick
            if (!products || !products.length) {
                await fetchAllProducts();
            }
            if (mounted) {
                const p2 = (products || []).find((x) => x._id === id);
                if (p2) setProduct(p2);
                // ensure viewport is at top when product displayed
                window.scrollTo(0, 0);
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, [id, products, fetchAllProducts, fetchProductById]);

    return (
        <>
            <Header />
            <div className="breadcrumbs_area">
                <div className="mx-auto px-4">
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
                                    <li>{product ? product.name : loading ? "loading..." : "product not found"}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {loading && !product ? (
                <div className="mx-auto px-4 py-12 text-center">
                    <div className="text-lg font-medium">Loading product...</div>
                </div>
            ) : !product ? (
                <div className="mx-auto px-4 py-12 text-center">
                    <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
                    <p className="mb-6">We couldn't find that product. It may have been removed.</p>
                    <Link
                        to="/shop"
                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded">
                        Return to shop
                    </Link>
                </div>
            ) : (
                <div className="product_details">
                    <div className="mx-auto px-4">
                        <div className="pos_page_inner">
                            <div className="flex flex-wrap -mx-4">
                                <div className="w-full lg:w-6/12 px-4">
                                    <ProductGallery
                                        product={product}
                                        loading={loading}
                                    />
                                </div>
                                <div className="w-full lg:w-6/12 px-4">
                                    <ProductDetails
                                        product={product}
                                        loading={loading}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-auto px-4">
                <div className="pos_page_inner">
                    <ProductTabs product={product} />
                    <RelatedProducts currentProduct={product} />
                </div>
            </div>

            <Footer />
            <ProductModal />
        </>
    );
}
