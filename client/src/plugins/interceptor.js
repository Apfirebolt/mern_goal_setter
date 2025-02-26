import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/'
});

axiosInstance.interceptors.request.use(
    config => {
        // You can modify the request config here if needed
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => {
        // You can modify the response here if needed
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axiosInstance;