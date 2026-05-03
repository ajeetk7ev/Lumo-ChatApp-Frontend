import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    conversations: [],
    activeConversation: null,
    messages: [],
    onlineUsers: [],
    typingUsers: [], // Array of conversationIds or userIds
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setConversations: (state, action) => {
            state.conversations = action.payload;
        },
        setActiveConversation: (state, action) => {
            state.activeConversation = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            const exists = state.messages.find(m => m._id === action.payload._id);
            if (!exists) {
                state.messages.push(action.payload);
            } else {
                // If it exists (e.g. optimistic update), update it
                const index = state.messages.findIndex(m => m._id === action.payload._id);
                state.messages[index] = action.payload;
            }
            // Update last message in conversation list
            const index = state.conversations.findIndex(c => c._id === action.payload.conversationId || c._id === action.payload.conversation);
            if (index !== -1) {
                state.conversations[index].lastMessage = action.payload;
                // Move to top
                const [conv] = state.conversations.splice(index, 1);
                state.conversations.unshift(conv);
            }
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setTyping: (state, action) => {
            const { conversationId, isTyping } = action.payload;
            if (isTyping) {
                if (!state.typingUsers.includes(conversationId)) {
                    state.typingUsers.push(conversationId);
                }
            } else {
                state.typingUsers = state.typingUsers.filter(id => id !== conversationId);
            }
        },
        removeMessage: (state, action) => {
            state.messages = state.messages.filter(m => m._id !== action.payload);
        },
    },
});

export const { 
    setConversations, 
    setActiveConversation, 
    setMessages, 
    addMessage, 
    setOnlineUsers,
    setTyping,
    removeMessage
} = chatSlice.actions;

export default chatSlice.reducer;
