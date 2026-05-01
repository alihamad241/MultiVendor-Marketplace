import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../libs/axios";

export const useProductStore = create((set, get) => ({
    products: [],
    featuredProducts: [],
    selectedProduct: null,
    loading: false,
    setProducts: (products) => set({ products }),
    setFeaturedProducts: (featured) => set({ featuredProducts: featured }),
    setSelectedProduct: (product) => set({ selectedProduct: product }),
    createProduct: async (productData) => {
        set({ loading: true });
        try {
            const res = await axios.post("/products", productData);
            // refresh product lists from server to avoid stale state
            try {
                await get().fetchAllProducts();
                await get().fetchFeaturedProducts();
            } catch (e) {
                // ignore refresh errors but keep the created product in state
                const created = res.data.product || res.data;
                set((prevState) => ({ products: [...(prevState.products || []), created], loading: false }));
                return res.data.product || res.data;
            }
            set({ loading: false });
            return res.data.product || res.data;
        } catch (error) {
            const msg = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to create product";
            toast.error(msg);
            set({ loading: false });
            throw error;
        }
    },
    fetchAllProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/products");
            // accept either { products: [...] } or an array
            const data = response.data?.products || response.data || [];
            set({ products: data, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch products", loading: false });
            const msg = error?.response?.data?.error || error?.message || "Failed to fetch products";
            toast.error(msg);
        }
    },
    fetchProductById: async (id) => {
        set({ loading: true });
        try {
            const res = await axios.get(`/products/${id}`);
            // backend may return { product }
            const product = res.data.product || res.data;
            set({ selectedProduct: product, loading: false });
            return product;
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.error || "Failed to fetch product");
            return null;
        }
    },
    fetchProductByCategory: async () => {
        // expects a category string argument
        return async (category) => {
            set({ loading: true });
            try {
                const response = await axios.get(`/products/category/${category}`);
                const data = response.data?.products || response.data || [];
                set({ products: data, loading: false });
            } catch (error) {
                set({ error: "Failed to fetch products by category", loading: false });
                const msg = error?.response?.data?.error || error?.message || "Failed to fetch products";
                toast.error(msg);
            }
        };
    },
    fetchFilteredProducts: async ({ category, gender } = {}) => {
        set({ loading: true });
        try {
            const params = {};
            if (category) params.category = category;
            if (gender) params.gender = gender;
            const response = await axios.get("/products", { params });
            const data = response.data?.products || response.data || [];
            set({ products: data, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch filtered products", loading: false });
            const msg = error?.response?.data?.error || error?.message || "Failed to fetch products";
            toast.error(msg);
        }
    },
    deleteProduct: async (productId) => {
        set({ loading: true });
        try {
            await axios.delete(`/products/${productId}`);
            set((prevProducts) => ({
                products: (prevProducts.products || []).filter((product) => product._id !== productId),
                loading: false,
            }));
        } catch (error) {
            set({ loading: false });
            const msg = error?.response?.data?.error || error?.message || "Failed to delete product";
            toast.error(msg);
        }
    },
    toggleFeaturedProduct: async (productId) => {
        set({ loading: true });
        try {
            const response = await axios.patch(`/products/${productId}`);
            // backend may return the updated product or an object with { product }
            const updated = response.data.product || response.data;
            const isFeatured = updated.isFeatured;
            set((state) => ({
                // update the global products list if present
                products: state.products.map((product) => (product._id === productId ? updated : product)),
                // update featuredProducts: add/update when featured, remove when not
                featuredProducts: isFeatured
                    ? (() => {
                          const exists = state.featuredProducts.find((p) => p._id === productId);
                          return exists
                              ? state.featuredProducts.map((p) => (p._id === productId ? updated : p))
                              : [...state.featuredProducts, updated];
                      })()
                    : state.featuredProducts.filter((p) => p._id !== productId),
                loading: false,
            }));
        } catch (error) {}
    },
    fetchFeaturedProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/products/featured");
            // accept either { products: [...] } or [...]
            const data = response.data.products || response.data;
            set({ featuredProducts: data, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch products", loading: false });
            console.log("Error fetching featured products:", error);
        }
    },
}));
