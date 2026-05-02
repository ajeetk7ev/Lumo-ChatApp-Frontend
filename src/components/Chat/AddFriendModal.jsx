import React, { useState, useEffect, useRef, useCallback } from "react";
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
    const [fetchingMore, setFetchingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [sendingRequestId, setSendingRequestId] = useState(null);
    
    const observer = useRef();
    const lastElementRef = useCallback(node => {
        if (loading || fetchingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, fetchingMore, hasMore]);

    const fetchUsers = async (searchQuery, pageNum, isInitial = false) => {
        if (isInitial) setLoading(true);
        else setFetchingMore(true);

        try {
            const data = await friendsService.searchUsers(searchQuery, pageNum);
            const { users, pagination } = data.data;
            
            setResults(prev => pageNum === 1 ? users : [...prev, ...users]);
            setHasMore(pagination.hasNextPage);
        } catch (error) {
            console.error("Fetch users failed", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
            setFetchingMore(false);
        }
    };

    // Handle search query change
    useEffect(() => {
        if (!open) return;

        const timer = setTimeout(() => {
            setPage(1);
            setResults([]);
            setHasMore(true);
            fetchUsers(query, 1, true);
        }, 400);

        return () => clearTimeout(timer);
    }, [query, open]);

    // Handle pagination
    useEffect(() => {
        if (page > 1 && open) {
            fetchUsers(query, page, false);
        }
    }, [page, open]);

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
            <DialogContent className="sm:max-w-md bg-[#0B0E14] border-white/5 text-white">
                <DialogHeader>
                    <DialogTitle>Add Friends</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Discover new people or search by username.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input 
                        placeholder="Search users..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-blue-500 h-11 rounded-xl"
                    />
                </div>

                <ScrollArea className="h-[350px] mt-4 pr-4">
                    {loading && results.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : results.length > 0 ? (
                        <div className="space-y-2">
                            {results.map((user, index) => (
                                <div 
                                    key={user._id} 
                                    ref={index === results.length - 1 ? lastElementRef : null}
                                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Avatar className="h-10 w-10 border border-white/10">
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                                                    {user.username[0].toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                                                {user.fullName}
                                            </span>
                                            <span className="text-xs text-gray-500">@{user.username}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {user.friendshipStatus === "accepted" ? (
                                            <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-500 border-none px-3 py-1 rounded-lg">
                                                <Check className="w-3 h-3" /> Friends
                                            </Badge>
                                        ) : user.friendshipStatus === "pending" ? (
                                            <Badge variant="secondary" className="gap-1 bg-yellow-500/10 text-yellow-500 border-none px-3 py-1 rounded-lg">
                                                <Clock className="w-3 h-3" /> Pending
                                            </Badge>
                                        ) : (
                                            <Button 
                                                size="sm" 
                                                variant="secondary"
                                                onClick={() => handleSendRequest(user._id)}
                                                disabled={sendingRequestId === user._id}
                                                className="h-9 rounded-xl bg-blue-600 text-white hover:bg-blue-500 border-none px-4 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                                            >
                                                {sendingRequestId === user._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <UserPlus className="w-4 h-4 mr-2" />
                                                        Add
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {fetchingMore && (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-10">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                <Search className="w-8 h-8 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-white font-medium">No users found</p>
                                <p className="text-gray-500 text-sm">Try searching with a different name or username.</p>
                            </div>
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default AddFriendModal;

