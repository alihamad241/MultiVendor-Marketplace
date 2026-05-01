import React from "react";

export default function ProductModal({ isOpen = false, onClose = null, product = null }) {
    if (!isOpen) return null;

    const title = product?.title || product?.name || "Handbag feugiat";
    const img = product?.image || "/assets/img/product/product13.jpg";
    const price = product?.price ? `$${product.price}` : "$64.99";
    const oldPrice = product?.oldPrice ? `$${product.oldPrice}` : "$78.99";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={() => onClose && onClose()}
            />
            <div className="relative bg-white rounded-lg overflow-hidden max-w-3xl w-full mx-4">
                <button
                    type="button"
                    className="absolute top-3 right-3 text-2xl"
                    onClick={() => onClose && onClose()}
                    aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <div className="modal_body py-6">
                    <div className="mx-auto px-4">
                        <div className="flex flex-wrap -mx-4">
                            <div className="lg:w-5/12 w-full px-4">
                                <div className="modal_tab">
                                    <div
                                        className="tab-content"
                                        id="pills-tabContent">
                                        <div
                                            className="tab-pane fade show active"
                                            id="tab1"
                                            role="tabpanel">
                                            <div className="modal_tab_img">
                                                <a href="#">
                                                    <img
                                                        src={img}
                                                        alt=""
                                                        className="w-full block rounded"
                                                    />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-7/12 w-full px-4">
                                <div className="modal_right">
                                    <div className="modal_title mb-4">
                                        <h2 className="text-2xl font-semibold">{title}</h2>
                                    </div>
                                    <div className="modal_price mb-4">
                                        <span className="new_price text-xl font-bold mr-2">{price}</span>{" "}
                                        <span className="old_price text-gray-500 line-through">{oldPrice}</span>
                                    </div>
                                    <div className="modal_content mb-4 text-gray-700">
                                        <p>Short-sleeved blouse with feminine draped sleeve detail.</p>
                                    </div>
                                    <div className="modal_add_to_cart mb-4">
                                        <form
                                            action="#"
                                            className="flex items-center gap-3">
                                            <input
                                                min="0"
                                                max="100"
                                                step="1"
                                                defaultValue={1}
                                                type="number"
                                                className="w-20 border border-gray-300 rounded px-2 py-1"
                                            />
                                            <button
                                                type="submit"
                                                className="bg-blue-600 text-white px-4 py-2 rounded">
                                                add to cart
                                            </button>
                                        </form>
                                    </div>
                                    <div className="modal_description mb-4 text-gray-700">
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
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
