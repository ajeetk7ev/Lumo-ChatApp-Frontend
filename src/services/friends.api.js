import API from "../api/api";

const friendsService = {
    getFriends: async () => {
        const response = await API.get("/friends/friends");
        return response.data;
    },

    getPendingRequests: async () => {
        const response = await API.get("/friends/pending");
        return response.data;
    },

    sendRequest: async (receiverId) => {
        const response = await API.post("/friends/send", { receiverId });
        return response.data;
    },

    acceptRequest: async (requestId) => {
        const response = await API.post(`/friends/accept/${requestId}`);
        return response.data;
    },

    rejectRequest: async (requestId) => {
        const response = await API.post(`/friends/reject/${requestId}`);
        return response.data;
    },

    searchUsers: async (query = "", page = 1, limit = 20) => {
        const response = await API.get(`/friends/search?query=${query}&page=${page}&limit=${limit}`);
        return response.data;
    },
};

export default friendsService;
