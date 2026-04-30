import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    withCredentials: true, // Required for cookies
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor for logging or adding headers
API.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling common errors (like 401 Unauthorized)
API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle global errors here (e.g., refresh token, logout on 401)
        if (error.response?.status === 401) {
            // Potential auto-logout logic or token refresh
        }
        return Promise.reject(error);
    }
);

export default API;
