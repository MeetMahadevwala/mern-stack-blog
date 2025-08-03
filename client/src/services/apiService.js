import axios from "axios";
import { config } from "dotenv";
const token = localStorage.getItem('jwt');

const apiService = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}`}),
    },
});

apiService.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiService;