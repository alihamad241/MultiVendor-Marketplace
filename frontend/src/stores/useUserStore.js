import { create } from "zustand";
import axios from "../libs/axios";
import { toast } from "react-hot-toast"; //notification that can be shown to the user

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signup: async ({ name, email, password }) => {
        set({ loading: true });
        // if (password != confirmPassword) {
        //     set({ loading: false });
        //     return toast.error("Passwords do not match");
        // }

        try {
            const res = await axios.post("/auth/signup", {
                name,
                email,
                password,
            });
            set({ user: res.data.user, loading: false });
            toast.success("Signup successful");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "Something went wrong, please try again.");
        }
    },

    login: async (email, password) => {
        set({ loading: true });
        try {
            const res = await axios.post("/auth/login", {
                email,
                password,
            });
            // server returns { user: {..}, message }
            set({ user: res.data.user, loading: false });
            toast.success("Login successful");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "Something went wrong, please try again.");
        }
    },
    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axios.get("/auth/profile");
            set({ user: response.data, checkingAuth: false });
        } catch (error) {
            set({ user: null, checkingAuth: false });
        }
    },
    logout: async () => {
        try {
            await axios.post("/auth/logout");
            set({ user: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong, please try again.");
        }
    },
    refreshToken: async () => {
        if (get().checkingAuth) return;
        set({ checkingAuth: true });
        try {
            const response = await axios.post("/auth/refresh-token");
            set({ checkingAuth: false });
            return response.data; //not important cause it will be handled by the interceptor
        } catch (error) {
            set({ user: null, checkingAuth: false });
            toast.error("Session expired, please login again");
            throw error;
        }
    },
}));

// todo-->implement the axios interceptors for refreshing the access token

let refreshPromise = null;

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                if (refreshPromise) {
                    await refreshPromise;
                    return axios(originalRequest);
                }
                refreshPromise = useUserStore.getState().refreshToken();
                await refreshPromise;
                refreshPromise = null;
                return axios(originalRequest);
            } catch (refreshError) {
                useUserStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
