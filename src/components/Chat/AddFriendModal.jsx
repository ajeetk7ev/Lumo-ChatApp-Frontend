import React, { useState, useEffect } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Loader2, Check, Clock } from "lucide-react";
import friendsService from "@/services/friends.api";
import { toast } from "react-hot-toast";

const AddFriendModal = ({ open, onOpenChange }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sendingRequestId, setSendingRequestId] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim()) {
                handleSearch();
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const data = await friendsService.searchUsers(query);
            setResults(data.data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendRequest = async (userId) => {
        setSendingRequestId(userId);
        try {
            await friendsService.sendRequest(userId);
            toast.success("Friend request sent!");
            // Update local state to show pending
            setResults(prev => prev.map(user => 
                user._id === userId ? { ...user, friendshipStatus: "pending", isSender: true } : user
            ));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send request");
        } finally {
            setSendingRequestId(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Friends</DialogTitle>
                    <DialogDescription>
                        Search for people by username or full name.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input 
                        placeholder="Search users..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <ScrollArea className="h-[300px] mt-4 pr-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                        </div>
                    ) : results.length > 0 ? (
                        <div className="space-y-4">
                            {results.map((user) => (
                                <div key={user._id} className="flex items-center justify-between p-2 rounded-2xl hover:bg-white/5 transition-all">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white">{user.fullName}</span>
                                            <span className="text-xs text-gray-500">@{user.username}</span>
                                        </div>
                                    </div>

                                    {user.friendshipStatus === "accepted" ? (
                                        <Badge variant="success" className="gap-1">
                                            <Check className="w-3 h-3" /> Friends
                                        </Badge>
                                    ) : user.friendshipStatus === "pending" ? (
                                        <Badge variant="warning" className="gap-1">
                                            <Clock className="w-3 h-3" /> Pending
                                        </Badge>
                                    ) : (
                                        <Button 
                                            size="sm" 
                                            variant="secondary"
                                            onClick={() => handleSendRequest(user._id)}
                                            disabled={sendingRequestId === user._id}
                                            className="h-8 rounded-xl bg-blue-600 text-white hover:bg-blue-500 border-none"
                                        >
                                            {sendingRequestId === user._id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <UserPlus className="w-4 h-4 mr-1" />
                                                    Add
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : query.trim() ? (
                        <div className="text-center py-10 text-gray-500 text-sm">
                            No users found for "{query}"
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500 text-sm">
                            Start typing to search for users
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default AddFriendModal;
