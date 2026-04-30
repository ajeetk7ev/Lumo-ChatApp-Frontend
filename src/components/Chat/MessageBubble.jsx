import React from "react";
import { Check, CheckCheck, FileText, Download } from "lucide-react";

const MessageBubble = ({ message, isOwn, otherUser }) => {
    const isFile = message.fileUrl;

    return (
        <div className={`flex items-end gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            {!isOwn && (
                <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-white/5 mb-1">
                    <img src={otherUser?.avatar} alt="" className="w-full h-full object-cover" />
                </div>
            )}

            <div className={`flex flex-col gap-1 max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
                {/* Content */}
                <div className={`relative px-5 py-3 rounded-2xl shadow-lg border ${
                    isOwn 
                        ? "bg-blue-600 border-blue-500 rounded-br-none text-white shadow-blue-600/10" 
                        : "bg-[#111] border-white/5 rounded-bl-none text-gray-200"
                }`}>
                    {isFile ? (
                        <div className="flex items-center gap-4 min-w-[200px]">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                isOwn ? "bg-white/20" : "bg-blue-600/10 text-blue-500"
                            }`}>
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">{message.content || "Document"}</p>
                                <p className={`text-[10px] ${isOwn ? "text-white/60" : "text-gray-500"}`}>
                                    {message.fileSize || "1.2 MB"}
                                </p>
                            </div>
                            <button className={`p-2 rounded-lg transition-colors ${
                                isOwn ? "hover:bg-white/10" : "hover:bg-white/5"
                            }`}>
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <p className="text-sm leading-relaxed">{message.content}</p>
                    )}

                    {/* Timestamp & Status Overlay for Own Messages */}
                    {isOwn && (
                        <div className="flex items-center gap-1 mt-1 justify-end">
                            <span className="text-[10px] text-white/60">
                                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {message.seen ? (
                                <CheckCheck className="w-3 h-3 text-blue-200" />
                            ) : (
                                <Check className="w-3 h-3 text-white/60" />
                            )}
                        </div>
                    )}
                </div>

                {/* Timestamp for Received Messages */}
                {!isOwn && (
                    <span className="text-[10px] text-gray-600 font-bold px-1 mt-0.5">
                        {otherUser?.fullName.split(" ")[0]} • {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;
