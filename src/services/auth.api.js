import API from "../api/api";

const authService = {
    register: async (formData) => {
        const response = await API.post("/auth/register", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    login: async (credentials) => {
        const response = await API.post("/auth/login", credentials);
        return response.data;
    },

    logout: async () => {
        const response = await API.post("/auth/logout");
        return response.data;
    },

    refreshToken: async () => {
        const response = await API.post("/auth/refresh-token");
        return response.data;
    },

    // getCurrentUser could be a separate endpoint if defined in backend
    // For now, we'll rely on the login/register response which usually contains user data
};

export default authService;
