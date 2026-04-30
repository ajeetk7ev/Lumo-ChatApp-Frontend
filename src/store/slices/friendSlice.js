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
            state.friends.push(action.payload);
        },
        removePendingRequest: (state, action) => {
            state.pendingRequests = state.pendingRequests.filter(r => r._id !== action.payload);
        },
    },
});

export const { setFriends, setPendingRequests, addFriend, removePendingRequest } = friendSlice.actions;
export default friendSlice.reducer;
