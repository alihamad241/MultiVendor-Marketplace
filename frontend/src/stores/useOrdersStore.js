import { create } from "zustand";
import axios from "../libs/axios";
import { toast } from "react-hot-toast";

export const useOrdersStore = create((set, get) => ({
    orders: [],
    loading: false,
    error: null,

    fetchOrders: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get("/auth/orders");
            const data = res.data || [];
            set({ orders: data });
            return data;
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Failed to load orders";
            set({ error: msg, orders: [] });
            toast.error(msg);
            return [];
        } finally {
            set({ loading: false });
        }
    },

    getOrderById: (id) => {
        const s = get();
        return s.orders.find((o) => String(o._id || o.id) === String(id));
    },
}));

export default useOrdersStore;
