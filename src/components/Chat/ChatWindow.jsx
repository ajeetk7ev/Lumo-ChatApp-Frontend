import React, { useEffect, useRef } from "react";
import { 
    Phone, 
    Video, 
    User, 
    MoreHorizontal, 
    Search,
    Loader2
} from "lucide-react";
import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

const ChatWindow = () => {
    const { activeConversation, messages, typingUsers } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.auth);
    const scrollRef = useRef(null);

    const getOtherParticipant = (participants) => {
        return participants?.find(p => p._id !== user?._id);
    };

    const otherUser = getOtherParticipant(activeConversation?.participants);
    const isTyping = typingUsers.includes(activeConversation?._id);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    if (!activeConversation) {
        return (
            <div className="flex-1 h-screen bg-[#050505] flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-blue-500" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Your Messages</h1>
                <p className="text-gray-500 max-w-xs">Select a conversation from the sidebar to start chatting with your friends.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 h-screen bg-[#050505] flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 shrink-0 bg-[#050505]/80 backdrop-blur-xl z-20">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-11 h-11 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                            <img src={otherUser?.avatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#050505] rounded-full"></div>
                    </div>
                    <div>
                        <h2 className="font-bold text-white leading-tight">{otherUser?.fullName}</h2>
                        <span className="text-[11px] text-green-500 font-bold uppercase tracking-wider">Online</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <Search className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <User className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-white/5 mx-2"></div>
                    <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                {messages.map((msg, i) => (
                    <MessageBubble 
                        key={msg._id || i} 
                        message={msg} 
                        isOwn={msg.sender?._id === user?._id || msg.sender === user?._id}
                        otherUser={otherUser}
                    />
                ))}
                
                {isTyping && (
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0">
                            <img src={otherUser?.avatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-blue-600/10 text-blue-500 px-4 py-2 rounded-2xl rounded-tl-none border border-blue-500/10 flex items-center gap-2">
                            <span className="text-xs font-bold">typing</span>
                            <div className="flex gap-1">
                                <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></span>
                                <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <ChatInput />
        </div>
    );
};

export default ChatWindow;
