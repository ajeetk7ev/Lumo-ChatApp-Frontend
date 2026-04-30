import API from "../api/api";

const chatService = {
    getConversations: async () => {
        const response = await API.get("/chat/conversations");
        return response.data;
    },

    getOrCreateConversation: async (participantId) => {
        const response = await API.post("/chat/conversations", { participantId });
        return response.data;
    },

    sendMessage: async (messageData) => {
        const response = await API.post("/chat/messages", messageData);
        return response.data;
    },

    getMessages: async (conversationId) => {
        const response = await API.get(`/chat/messages/${conversationId}`);
        return response.data;
    },

    markAsSeen: async (conversationId) => {
        const response = await API.patch(`/chat/messages/${conversationId}/seen`);
        return response.data;
    },
};

export default chatService;
