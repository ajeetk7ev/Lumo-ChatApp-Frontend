import React from "react";
import { Search, MoreHorizontal } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveConversation } from "../../store/slices/chatSlice";

const ChatsPanel = () => {
    const { conversations, activeConversation, onlineUsers } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const getOtherParticipant = (participants) => {
        return participants.find(p => p._id !== user?._id);
    };

    return (
        <div className="w-[350px] h-screen bg-[#0a0a0a] border-r border-white/5 flex flex-col shrink-0">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-white">Chats</h1>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-500">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search messages or users"
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/30 transition-all"
                    />
                </div>

                {/* Online Users Horizontal List */}
                <div className="mb-8">
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                        {onlineUsers.map((onlineUser, i) => (
                            <div key={i} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 group-hover:border-blue-500/50 transition-colors">
                                        <img src={onlineUser.avatar} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#0a0a0a] rounded-full"></div>
                                </div>
                                <span className="text-[10px] text-gray-500 font-medium group-hover:text-white transition-colors">
                                    {onlineUser.username.split(" ")[0]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Recent</h2>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto space-y-1 pr-2 -mr-2">
                    {conversations.map((conv) => {
                        const otherUser = getOtherParticipant(conv.participants);
                        const isActive = activeConversation?._id === conv._id;
                        const isOnline = onlineUsers.some(u => u._id === otherUser?._id);

                        return (
                            <div 
                                key={conv._id}
                                onClick={() => dispatch(setActiveConversation(conv))}
                                className={`p-3 rounded-2xl flex gap-4 cursor-pointer transition-all ${
                                    isActive ? "bg-blue-600/10" : "hover:bg-white/5"
                                }`}
                            >
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10">
                                        <img src={otherUser?.avatar} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    {isOnline && (
                                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#0a0a0a] rounded-full"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`text-sm font-bold truncate ${isActive ? "text-blue-500" : "text-gray-200"}`}>
                                            {otherUser?.fullName}
                                        </h3>
                                        <span className="text-[10px] text-gray-600 font-medium">
                                            {conv.lastMessage ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-500 truncate mr-2">
                                            {conv.lastMessage?.content || "No messages yet"}
                                        </p>
                                        {conv.unreadCount > 0 && (
                                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ChatsPanel;
