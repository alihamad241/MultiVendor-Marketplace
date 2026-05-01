import React, { useState } from "react";

export default function ProductTabs({ product = null }) {
    const [activeTab, setActiveTab] = useState("info");

    const setTab = (tab) => setActiveTab(tab);

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
                                            className={`inline-block px-3 py-2 rounded ${activeTab === "info" ? "bg-gray-100" : ""}`}
                                            onClick={() => setTab("info")}>
                                            More info
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            className={`inline-block px-3 py-2 rounded ${
                                                activeTab === "sheet" ? "bg-gray-100" : "hover:bg-gray-100"
                                            }`}
                                            onClick={() => setTab("sheet")}>
                                            Data sheet
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            className={`inline-block px-3 py-2 rounded ${
                                                activeTab === "reviews" ? "bg-gray-100" : "hover:bg-gray-100"
                                            }`}
                                            onClick={() => setTab("reviews")}>
                                            Reviews
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div className="tab-content mt-6">
                                {activeTab === "info" && (
                                    <div
                                        className="tab-pane fade show active"
                                        id="info"
                                        role="tabpanel">
                                        <div className="product_info_content text-gray-700">
                                            <p>
                                                {product?.description ||
                                                    "Fashion has been creating well-designed collections since 2010. The brand offers feminine designs delivering stylish separates and statement dresses."}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "sheet" && (
                                    <div
                                        className="tab-pane fade"
                                        id="sheet"
                                        role="tabpanel">
                                        <div className="product_d_table">
                                            <form action="#">
                                                <table className="w-full text-sm">
                                                    <tbody>
                                                        <tr>
                                                            <td className="first_child font-semibold">Compositions</td>
                                                            <td>Polyester</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="first_child font-semibold">Styles</td>
                                                            <td>Girly</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="first_child font-semibold">Properties</td>
                                                            <td>Short Dress</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </form>
                                            <div className="product_info_content text-gray-700 mt-4">
                                                <p>Additional sheet information about the product.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "reviews" && (
                                    <div
                                        className="tab-pane fade"
                                        id="reviews"
                                        role="tabpanel">
                                        <div className="product_info_content text-gray-700">
                                            <p>Customer reviews and summary.</p>
                                        </div>
                                        <div className="product_info_inner mt-4">
                                            <div className="product_ratting mb-4">
                                                <ul className="flex gap-1 text-yellow-400">
                                                    <li>
                                                        <a href="#">
                                                            <i className="fa fa-star"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <i className="fa fa-star"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <i className="fa fa-star"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <i className="fa fa-star"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <i className="fa fa-star"></i>
                                                        </a>
                                                    </li>
                                                </ul>
                                                <strong className="block mt-2">Posthemes</strong>
                                                <p className="text-sm">09/07/2023</p>
                                            </div>
                                            <div className="product_demo mt-3">
                                                <strong>demo</strong>
                                                <p>That's OK!</p>
                                            </div>
                                        </div>
                                        <div className="product_review_form mt-4">
                                            <form action="#">
                                                <h2 className="text-xl font-semibold">Add a review </h2>
                                                <p className="text-sm text-gray-600">
                                                    Your email address will not be published. Required fields are marked{" "}
                                                </p>
                                                <div className="row mt-4">
                                                    <div className="w-full">
                                                        <label
                                                            htmlFor="review_comment"
                                                            className="block text-sm mb-1">
                                                            Your review
                                                        </label>
                                                        <textarea
                                                            name="comment"
                                                            id="review_comment"
                                                            className="w-full border rounded p-2"></textarea>
                                                    </div>
                                                    <div className="w-full md:w-1/2 mt-3 md:mt-0 px-2">
                                                        <label
                                                            htmlFor="author"
                                                            className="block text-sm mb-1">
                                                            Name
                                                        </label>
                                                        <input
                                                            id="author"
                                                            type="text"
                                                            className="w-full border rounded p-2"
                                                        />
                                                    </div>
                                                    <div className="w-full md:w-1/2 mt-3 md:mt-0 px-2">
                                                        <label
                                                            htmlFor="email"
                                                            className="block text-sm mb-1">
                                                            Email
                                                        </label>
                                                        <input
                                                            id="email"
                                                            type="text"
                                                            className="w-full border rounded p-2"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                                                    Submit
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
