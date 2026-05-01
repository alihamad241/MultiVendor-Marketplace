// using axios instead of classis fetch  because it gives u more control over request and response and more things out of the box and more convinient
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "/api/", 
    withCredentials: true, 
});

export default axiosInstance;