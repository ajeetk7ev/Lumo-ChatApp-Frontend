import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    friends: [],
    pendingRequests: [],
};

const friendSlice = createSlice({
    name: "friend",
    initialState,
    reducers: {
        setFriends: (state, action) => {
            state.friends = action.payload;
        },
        setPendingRequests: (state, action) => {
            state.pendingRequests = action.payload;
        },
        addFriend: (state, action) => {
            const exists = state.friends.find(f => f._id === action.payload._id);
            if (!exists) {
                state.friends.push(action.payload);
            }
        },
        addPendingRequest: (state, action) => {
            const exists = state.pendingRequests.find(r => r._id === action.payload._id);
            if (!exists) {
                state.pendingRequests.push(action.payload);
            }
        },
        removePendingRequest: (state, action) => {
            state.pendingRequests = state.pendingRequests.filter(r => r._id !== action.payload);
        },
    },
});

export const { 
    setFriends, 
    setPendingRequests, 
    addFriend, 
    addPendingRequest,
    removePendingRequest 
} = friendSlice.actions;

export default friendSlice.reducer;
