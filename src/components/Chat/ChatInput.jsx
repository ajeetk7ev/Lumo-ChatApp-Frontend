import React, { useState } from "react";
import { 
    Send, 
    Smile, 
    Paperclip, 
    Image as ImageIcon, 
    Mic,
    X
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import chatService from "../../services/chat.api";
import { addMessage } from "../../store/slices/chatSlice";
import { toast } from "react-hot-toast";

const ChatInput = () => {
    const [content, setContent] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const { activeConversation } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    const handleSend = async (e) => {
        e.preventDefault();
        if (!content.trim() || !activeConversation) return;

        const messageData = {
            conversationId: activeConversation._id,
            content: content.trim(),
        };

        try {
            const data = await chatService.sendMessage(messageData);
            dispatch(addMessage(data.data));
            setContent("");
            setShowEmoji(false);
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    const onEmojiClick = (emojiData) => {
        setContent(prev => prev + emojiData.emoji);
    };

    return (
        <div className="p-6 bg-[#050505] relative shrink-0">
            {showEmoji && (
                <div className="absolute bottom-24 left-6 z-50">
                    <div className="relative shadow-2xl">
                        <button 
                            onClick={() => setShowEmoji(false)}
                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 z-[60] shadow-lg hover:bg-red-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <EmojiPicker 
                            onEmojiClick={onEmojiClick} 
                            theme="dark"
                            width={350}
                            height={400}
                        />
                    </div>
                </div>
            )}

            <form 
                onSubmit={handleSend}
                className="bg-[#111] border border-white/5 rounded-3xl p-2 flex items-center gap-2 focus-within:border-blue-500/30 transition-all"
            >
                <div className="flex items-center gap-1 pl-2">
                    <button 
                        type="button"
                        onClick={() => setShowEmoji(!showEmoji)}
                        className={`p-2.5 rounded-2xl transition-all ${
                            showEmoji ? "bg-blue-600 text-white" : "text-gray-500 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        <Smile className="w-6 h-6" />
                    </button>
                    <button type="button" className="p-2.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                        <Paperclip className="w-6 h-6" />
                    </button>
                    <button type="button" className="p-2.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                        <ImageIcon className="w-6 h-6" />
                    </button>
                </div>

                <input 
                    type="text" 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter Message..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm py-3 px-2 placeholder-gray-600"
                />

                <div className="flex items-center gap-2 pr-2">
                    <button type="button" className="p-2.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                        <Mic className="w-6 h-6" />
                    </button>
                    <button 
                        type="submit"
                        disabled={!content.trim()}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-2xl transition-all active:scale-[0.95] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                    >
                        <Send className="w-6 h-6" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInput;
