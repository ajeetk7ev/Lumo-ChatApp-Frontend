import { createSlice } from "@reduxjs/toolkit";

const getSafeUser = () => {
    try {
        const user = localStorage.getItem("user");
        if (!user || user === "undefined") return null;
        return JSON.parse(user);
    } catch (error) {
        return null;
    }
};

const initialState = {
    user: getSafeUser(),
    isAuthenticated: !!getSafeUser(),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        clearAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            localStorage.removeItem("user");
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { setAuth, clearAuth, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
