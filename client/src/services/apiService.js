import axios from "axios";
// import { config } from "dotenv";

const apiService = axios.create({
    baseURL: 'http://localhost:5000/api',
});

apiService.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if(token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiService;