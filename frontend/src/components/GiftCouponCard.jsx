import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCouponStore } from "../stores/useCouponStore";

const GiftCouponCard = () => {
    const [userInputCode, setUserInputCode] = useState("");
    const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCouponStore();

    // useEffect(() => {
    //     getMyCoupon();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    useEffect(() => {
        if (coupon) setUserInputCode(coupon.code);
    }, [coupon]);

    const handleApplyCoupon = () => {
        if (!userInputCode) return;
        applyCoupon(userInputCode);
    };

    const handleRemoveCoupon = async () => {
        await removeCoupon();
        setUserInputCode("");
    };

    return (
        <div className="w-full border shadow-md bg-white">
            <div className="bg-black text-white px-4 py-2 font-bold">COUPON</div>

            <div className="p-4">
                <p className="text-sm text-gray-400 mb-2">Enter your coupon code if you have one.</p>

                <input
                    type="text"
                    placeholder="Coupon code"
                    className="w-full p-2 border border-gray-300 mb-2"
                    value={userInputCode}
                    onChange={(e) => setUserInputCode(e.target.value)}
                />

                <button
                    className="px-4 py-2 bg-black text-white font-bold hover:bg-[#00BBA6] cursor-pointer transition-colors duration-200"
                    onClick={handleApplyCoupon}>
                    APPLY COUPON
                </button>
                {isCouponApplied && coupon && (
                    <div className="mt-4 text-gray-400">
                        <p>Applied Coupon:</p>
                        <p className="text-black font-semibold">
                            {coupon.code} - {coupon.discountPercentage}% off
                        </p>
                        <button
                            onClick={handleRemoveCoupon}
                            className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium">
                            Remove Coupon
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GiftCouponCard;
