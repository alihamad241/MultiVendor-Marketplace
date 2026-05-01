import React, { useState, useEffect } from "react";

export default function ProductGallery({ product, loading }) {
    const [activePic, setActivePic] = useState(0);

    // reset active picture when a different product is selected
    useEffect(() => {
        // prefer using product._id when available to avoid resetting on shallow prop changes
        setActivePic(0);
    }, [product?._id]);

    // derive thumbnails from available product fields in priority order
    const thumbs = product
        ? Array.isArray(product.images) && product.images.length
            ? product.images
            : Array.isArray(product.gallery) && product.gallery.length
            ? product.gallery
            : product.image
            ? [product.image]
            : []
        : ["/assets/img/cart/cart.jpg", "/assets/img/cart/cart2.jpg", "/assets/img/cart/cart4.jpg"];

    const safeActive = Math.max(0, Math.min(activePic, Math.max(0, thumbs.length - 1)));
    const mainImage = thumbs[safeActive] || "/assets/img/product/product13.jpg";

    if (loading && !product) {
        return (
            <div className="w-full px-4">
                <div className="space-y-4 animate-pulse">
                    <div className="h-16 w-full bg-gray-100 rounded" />
                    <div className="h-64 w-full bg-gray-100 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-4">
            <div className="product_tab fix">
                <div className="product_tab_button">
                    <ul
                        className="nav flex gap-2"
                        role="tablist">
                        {thumbs.map((t, idx) => (
                            <li key={`thumb-${idx}`}>
                                <button
                                    type="button"
                                    className={`inline-block ${safeActive === idx ? "outline-none ring-2 ring-blue-300" : ""}`}
                                    onClick={() => setActivePic(idx)}>
                                    <img
                                        src={t}
                                        alt={product?.name || `thumb-${idx + 1}`}
                                        className="rounded border h-16 object-cover"
                                    />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="tab-content produc_tab_c mt-4">
                    <div
                        className="tab-pane fade show active"
                        id={`p_tab${safeActive + 1}`}
                        role="tabpanel">
                        <div className="modal_img relative">
                            <div className="bg-white p-6 border rounded flex items-center justify-center">
                                <a
                                    href="#"
                                    className="w-full block">
                                    <img
                                        src={mainImage}
                                        alt={product?.name || "product image"}
                                        className="w-full h-96 object-contain mx-auto block"
                                    />
                                </a>
                            </div>
                            <div className="img_icone absolute top-2 left-2">
                                <img
                                    src="/assets/img/cart/span-new.png"
                                    alt=""
                                />
                            </div>
                            <div className="view_img absolute top-2 right-2">
                                <a
                                    className="large_view inline-flex items-center justify-center p-2 bg-white border rounded"
                                    href={mainImage}>
                                    <i className="fa fa-search-plus"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
