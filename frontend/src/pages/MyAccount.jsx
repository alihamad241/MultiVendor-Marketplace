import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MyAccountDashboard from "../components/MyAccountDashboard";
import Breadcrumbs from "../components/Breadcrumbs";

export default function MyAccount() {
    return (
        <>
            <Header />
            <Breadcrumbs items={[{ label: "My Account" }]} />

            
            <MyAccountDashboard />
            
            <Footer />
        </>
    );
}
