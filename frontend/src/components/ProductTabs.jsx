import React, { useState } from "react";

export default function ProductTabs({ product = null }) {
    return (
        <div className="product_d_info py-8">
            <div className="mx-auto px-4">
                <div className="row">
                    <div className="w-full">
                        <div className="product_d_inner">
                            <div className="product_info_button">
                                <ul
                                    className="nav flex gap-4"
                                    role="tablist">
                                    <li>
                                        <button
                                            type="button"
                                            className="inline-block px-3 py-2 rounded bg-gray-100 font-bold text-emerald-600">
                                            More info
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div className="tab-content mt-6">
                                <div
                                    className="tab-pane fade show active"
                                    id="info"
                                    role="tabpanel">
                                    <div className="product_info_content text-gray-700 leading-relaxed">
                                        <p>
                                            {product?.description ||
                                                "No description available for this product."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
