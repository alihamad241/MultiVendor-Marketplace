import { create } from "zustand";
import axios from "../libs/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
    cart: [],
    wishlist: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    isCouponApplied: false,

    getCartItems: async () => {
        try {
            const res = await axios.get("/cart");
            // backend returns an array of cart items
            set({ cart: res.data });
            get().calculateTotals();
        } catch (error) {
            set({ cart: [] });
            toast.error(error.response.data.message || "Something went wrong, please try again.");
        }
    },

    clearCart: async () => {
        set({ cart: [], total: 0, subtotal: 0, coupon: null, isCouponApplied: false });
    },

    // coupon is managed by useCouponStore now; cart store keeps `coupon`/`isCouponApplied` mirrored for totals

    addToCart: async (productOrId) => {
        try {
            // accept either a product object or an id string
            const productId = typeof productOrId === "string" ? productOrId : productOrId?._id;
            if (!productId) {
                toast.error("Invalid product");
                return;
            }
            const res = await axios.post("/cart", { productId });
            toast.success("Product added to cart");

            // server returns populated cart items; update store directly
            set({ cart: res.data });
            get().calculateTotals();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong, please try again.");
        }
    },

    removeFromCart: async (productId) => {
        try {
            const res = await axios.delete(`/cart/`, { data: { productId } });
            toast.success("Product removed from cart");
            set({ cart: res.data });
            get().calculateTotals();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove item from cart");
        }
    },

    updateQuantity: async (productId, quantity) => {
        try {
            const res = await axios.put(`/cart/${productId}`, { quantity });
            set({ cart: res.data });
            get().calculateTotals();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update quantity");
        }
    },

    calculateTotals: () => {
        const { cart, coupon } = get();
        const SHIPPING = 15; // flat shipping rate (dollars)
        const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0);
        let discount = 0;
        if (coupon && coupon.discountPercentage) {
            discount = subtotal * (coupon.discountPercentage / 100);
        }
        const total = subtotal - discount + SHIPPING;

        set({ subtotal, total });
    },
    // wishlist helpers (client-side persisted)
    loadWishlist: () => {
        try {
            const raw = localStorage.getItem("wishlist_items");
            const list = raw ? JSON.parse(raw) : [];
            set({ wishlist: list });
        } catch (e) {
            set({ wishlist: [] });
        }
    },
    addToWishlist: (product) => {
        if (!product || !product._id) return;
        set((state) => {
            const exists = state.wishlist.find((p) => p._id === product._id);
            const updated = exists ? state.wishlist : [...state.wishlist, product];
            try {
                localStorage.setItem("wishlist_items", JSON.stringify(updated));
            } catch (e) {}
            return { wishlist: updated };
        });
        toast.success("Added to wishlist");
    },
    removeFromWishlist: (productId) => {
        set((state) => {
            const updated = state.wishlist.filter((p) => p._id !== productId);
            try {
                localStorage.setItem("wishlist_items", JSON.stringify(updated));
            } catch (e) {}
            return { wishlist: updated };
        });
        toast.success("Removed from wishlist");
    },
}));
