import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Chat/Sidebar";
import ChatsPanel from "../components/Chat/ChatsPanel";
import FriendsPanel from "../components/Chat/FriendsPanel";
import ChatWindow from "../components/Chat/ChatWindow";
import { initializeSocket, disconnectSocket } from "../socket/socket";
import { setOnlineUsers, addMessage, setTyping } from "../store/slices/chatSlice";
import chatService from "../services/chat.api";
import { setConversations } from "../store/slices/chatSlice";

const Home = () => {
    const [activeTab, setActiveTab] = useState("chats");
    const { user } = useSelector((state) => state.auth);
    const { activeConversation } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            const socket = initializeSocket(user._id);

            socket.on("getOnlineUsers", (users) => {
                dispatch(setOnlineUsers(users));
            });

            socket.on("newMessage", (message) => {
                // If the message is for the active conversation, add it to state
                if (activeConversation?._id === message.conversation) {
                    dispatch(addMessage(message));
                }
                // Refresh conversation list to show last message/unread count
                fetchConversations();
            });

            socket.on("typing", ({ conversationId, isTyping }) => {
                dispatch(setTyping({ conversationId, isTyping }));
            });

            return () => {
                disconnectSocket();
            };
        }
    }, [user, activeConversation, dispatch]);

    const fetchConversations = async () => {
        try {
            const data = await chatService.getConversations();
            dispatch(setConversations(data.data));
        } catch (error) {
            console.error("Failed to fetch conversations", error);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, [dispatch]);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#050505] text-white">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {activeTab === "chats" && <ChatsPanel />}
            {activeTab === "friends" && <FriendsPanel />}
            {activeTab === "profile" && (
                <div className="w-[350px] border-r border-white/5 flex items-center justify-center text-gray-500">
                    Profile Panel (Coming Soon)
                </div>
            )}
            {activeTab === "settings" && (
                <div className="w-[350px] border-r border-white/5 flex items-center justify-center text-gray-500">
                    Settings Panel (Coming Soon)
                </div>
            )}
            {activeTab === "notifications" && (
                <div className="w-[350px] border-r border-white/5 flex items-center justify-center text-gray-500">
                    Notifications Panel (Coming Soon)
                </div>
            )}

            <ChatWindow />
        </div>
    );
};

export default Home;
