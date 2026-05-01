import { create } from "zustand";
import axios from "../libs/axios";
import { toast } from "react-hot-toast";
import { useCartStore } from "./useCartStore";

export const useCouponStore = create((set, get) => ({
    coupon: null,
    isCouponApplied: false,
    loading: false,
    error: null,
    // admin state
    adminCoupons: [],
    adminLoading: false,
    adminError: null,

    // Fetch coupon for current user
    getMyCoupon: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get("/coupons");
            const coupon = res.data || null;
            set({ coupon, isCouponApplied: !!coupon });
            // mirror into cart store so totals keep working
            useCartStore.setState({ coupon, isCouponApplied: !!coupon });
            // recalc totals
            try {
                useCartStore.getState().calculateTotals();
            } catch (e) {}
        } catch (err) {
            set({ coupon: null, isCouponApplied: false, error: null });
        } finally {
            set({ loading: false });
        }
    },

    applyCoupon: async (code) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.post("/coupons/validate", { code });
            const payload = { code: res.data.code, discountPercentage: res.data.discountPercentage };
            set({ coupon: payload, isCouponApplied: true });
            useCartStore.setState({ coupon: payload, isCouponApplied: true });
            useCartStore.getState().calculateTotals();
            toast.success("Coupon applied");
        } catch (err) {
            const msg = err?.response?.data?.message || "Invalid coupon";
            set({ error: msg });
            toast.error(msg);
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    removeCoupon: async () => {
        set({ coupon: null, isCouponApplied: false });
        useCartStore.setState({ coupon: null, isCouponApplied: false });
        try {
            useCartStore.getState().calculateTotals();
        } catch (e) {}
        toast.success("Coupon removed");
    },

    // Admin helpers
    fetchCoupons: async () => {
        set({ adminLoading: true, adminError: null });
        try {
            const res = await axios.get("/coupons/admin");
            const data = res.data;
            const list = Array.isArray(data) ? data : Array.isArray(data?.coupons) ? data.coupons : [];
            set({ adminCoupons: list });
            return list;
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Failed to load coupons";
            set({ adminError: msg, adminCoupons: [] });
            toast.error(msg);
            return [];
        } finally {
            set({ adminLoading: false });
        }
    },

    createCoupon: async (payload) => {
        set({ adminLoading: true, adminError: null });
        try {
            const res = await axios.post("/coupons/admin/create", payload);
            toast.success("Coupon created");
            await get().fetchCoupons();
            return res.data;
        } catch (err) {
            const full = err?.response?.data || err;
            const msg = full?.message || err?.message || "Failed to create coupon";
            // surface full server response in console for debugging
            console.error("createCoupon failed", { payload, fullResponse: full });
            set({ adminError: typeof msg === "string" ? msg : JSON.stringify(msg) });
            toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
            // throw the full response object so callers can inspect details
            throw full;
        } finally {
            set({ adminLoading: false });
        }
    },

    deleteCoupon: async (code) => {
        set({ adminLoading: true, adminError: null });
        try {
            const res = await axios.delete(`/coupons/admin/${code}`);
            toast.success("Coupon deactivated");
            await get().fetchCoupons();
            return res.data;
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Failed to delete coupon";
            set({ adminError: msg });
            toast.error(msg);
            throw err;
        } finally {
            set({ adminLoading: false });
        }
    },
}));

export default useCouponStore;
