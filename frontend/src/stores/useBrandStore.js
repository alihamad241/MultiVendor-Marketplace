import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../libs/axios";

export const useBrandStore = create((set) => ({
    stores: [],
    loading: false,
    setStores: (stores) => set({ stores }),

    createStore: async (storeData) => {
        set({ loading: true });
        try {
            const res = await axios.post("stores", storeData);
            set((prev) => ({
                stores: [...prev.stores, res.data],
                loading: false,
            }));
            return res.data;
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || "Failed to create store";
            toast.error(msg);
            set({ loading: false });
            throw error;
        }
    },

    fetchAllStores: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("stores");
            set({ stores: response.data.stores || response.data, loading: false });
            return response.data;
        } catch (error) {
            const msg = error?.response?.data?.message || "Failed to fetch stores";
            toast.error(msg);
            set({ loading: false });
            return null;
        }
    },
    fetchStoreById: async (storeId) => {
        set({ loading: true });
        try {
            const response = await axios.get(`stores/${storeId}`);
            set({ loading: false });
            return response.data; // returns { store, products }
        } catch (error) {
            const msg = error?.response?.data?.message || "Failed to fetch store details";
            toast.error(msg);
            set({ loading: false });
            return null;
        }
    },
    deleteStore: async (storeId) => {
        set({ loading: true });
        try {
            await axios.delete(`stores/${storeId}`);
            set((prev) => ({
                stores: prev.stores.filter((s) => s._id !== storeId),
                loading: false,
            }));
        } catch (error) {
            const msg = error?.response?.data?.message || "Failed to delete store";
            toast.error(msg);
            set({ loading: false });
            throw error;
        }
    },

    pendingStores: [],
    fetchPendingStores: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("stores/pending");
            set({ pendingStores: res.data.stores, loading: false });
        } catch (error) {
            set({ loading: false });
            console.error("Fetch pending stores error", error);
        }
    },
    updateStoreStatus: async (storeId, status) => {
        set({ loading: true });
        try {
            await axios.patch(`stores/${storeId}/status`, { status });
            set((prev) => ({
                pendingStores: prev.pendingStores.filter((s) => s._id !== storeId),
                loading: false,
            }));
            // Refresh lists to sync state
            get().fetchAllStores();
            get().fetchPendingStores();
            toast.success(`Store ${status}`);
        } catch (error) {
            set({ loading: false });
            const msg = error?.response?.data?.message || "Failed to update store status";
            toast.error(msg);
        }
    },
    myStore: null,
    fetchMyStore: async () => {
        if (get().loading && get().myStore) return get().myStore;
        set({ loading: true });
        try {
            const res = await axios.get("stores/my-store");
            set({ myStore: res.data, loading: false });
            return res.data;
        } catch (error) {
            set({ loading: false, myStore: null });
            return null;
        }
    },
}));

export default useBrandStore;
