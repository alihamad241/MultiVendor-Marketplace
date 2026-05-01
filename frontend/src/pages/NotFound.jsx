import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function NotFound() {
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
                                    <li>404</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="error_section">
                <div className="mx-auto px-4">
                    <div className="flex flex-wrap -mx-4">
                        <div className="w-full">
                            <div className="error_form">
                                <h1>404</h1>
                                <h2>Opps! PAGE NOT BE FOUND</h2>
                                <p>
                                    Sorry but the page you are looking for does not exist, have been
                                    <br /> removed, name changed or is temporarity unavailable.
                                </p>
                                <form action="#">
                                    <input
                                        placeholder="Search..."
                                        type="text"
                                    />
                                    <button type="submit">
                                        <i className="fa fa-search"></i>
                                    </button>
                                </form>
                                <a href="/">Back to home page</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
