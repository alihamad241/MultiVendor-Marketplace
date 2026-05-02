import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useBrandStore } from "../stores/useBrandStore";
import { Loader, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BrandRegistration = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: ""
    });
    const { createStore, loading } = useBrandStore();
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createStore(formData);
            toast.success("Brand registered successfully!");
            navigate("/");
        } catch (error) {
            // Error handled by store
        }
    };

    return (
        <>
            <Header />
            <div className="breadcrumbs_area bg-gray-50 py-12">
                <div className="mx-auto px-4 max-w-4xl text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Become a Seller</h1>
                    <p className="mt-3 text-gray-600">
                        Launch your brand on ShopSphere and reach thousands of customers.
                    </p>
                </div>
            </div>

            <div className="customer_login py-12">
                <div className="mx-auto px-4 max-w-2xl">
                    <div className="account_form">
                        <h2 className="mb-6">Register Your Brand</h2>
                        <form onSubmit={handleSubmit}>
                            <p>
                                <label>Brand Name <span>*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </p>
                            <p>
                                <label>Description <span>*</span></label>
                                <textarea
                                    className="w-full border border-gray-300 p-2 min-h-[100px]"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </p>
                            <div className="mb-6">
                                <label className="block mb-2 font-semibold">Brand Logo <span>*</span></label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {formData.image ? (
                                                <img src={formData.image} alt="Preview" className="h-48 object-contain mb-2" />
                                            ) : (
                                                <>
                                                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                    <p className="text-xs text-gray-500">SVG, PNG, JPG (MAX. 800x400px)</p>
                                                </>
                                            )}
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required={!formData.image} />
                                    </label>
                                </div>
                            </div>
                            <div className="login_submit">
                                <button type="submit" disabled={loading} className="w-full">
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <Loader className="animate-spin h-4 w-4 mr-2" />
                                            Registering Brand...
                                        </div>
                                    ) : (
                                        "Register Brand"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default BrandRegistration;
