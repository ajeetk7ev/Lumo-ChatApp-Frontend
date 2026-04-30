import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

let socket = null;

export const initializeSocket = (userId) => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            query: { userId },
            transports: ["websocket"],
        });
    }
    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
