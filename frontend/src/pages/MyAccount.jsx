import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MyAccountDashboard from "../components/MyAccountDashboard";

export default function MyAccount() {
    return (
        <>
            <Header />
            <div className="breadcrumbs_area">
                <div className="row">
                    <div className="w-full">
                        <div className="breadcrumb_content">
                            <ul>
                                <li>
                                    <a href="/">home</a>
                                </li>
                                <li>
                                    <i className="fa fa-angle-right"></i>
                                </li>
                                <li>My Account</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            
            <MyAccountDashboard />
            
            <Footer />
        </>
    );
}
