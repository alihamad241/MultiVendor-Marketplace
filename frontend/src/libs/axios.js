// using axios instead of classis fetch  because it gives u more control over request and response and more things out of the box and more convinient
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_SERVER_URL || "";
const apiBaseURL = backendUrl ? `${backendUrl.replace(/\/$/, '')}/api/` : "/api/";

const axiosInstance = axios.create({
    baseURL: apiBaseURL, 
    withCredentials: true, 
});

export default axiosInstance;