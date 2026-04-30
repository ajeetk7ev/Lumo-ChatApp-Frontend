import React, { useState, useEffect } from "react";
import { Search, UserPlus, UserCheck, UserX, Clock, Users } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import friendsService from "../../services/friends.api";
import { setFriends, setPendingRequests, addFriend, removePendingRequest } from "../../store/slices/friendSlice";
import { toast } from "react-hot-toast";

const FriendsPanel = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { friends, pendingRequests } = useSelector((state) => state.friend);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchFriendsData = async () => {
            try {
                const [friendsData, pendingData] = await Promise.all([
                    friendsService.getFriends(),
                    friendsService.getPendingRequests()
                ]);
                dispatch(setFriends(friendsData.data));
                dispatch(setPendingRequests(pendingData.data));
            } catch (error) {
                console.error("Failed to fetch friends data", error);
            }
        };
        fetchFriendsData();
    }, [dispatch]);

    const handleAccept = async (requestId) => {
        try {
            const data = await friendsService.acceptRequest(requestId);
            dispatch(addFriend(data.data.friend));
            dispatch(removePendingRequest(requestId));
            toast.success("Friend request accepted!");
        } catch (error) {
            toast.error("Failed to accept request");
        }
    };

    const handleReject = async (requestId) => {
        try {
            await friendsService.rejectRequest(requestId);
            dispatch(removePendingRequest(requestId));
            toast.success("Friend request rejected");
        } catch (error) {
            toast.error("Failed to reject request");
        }
    };

    return (
        <div className="w-[350px] h-screen bg-[#0a0a0a] border-r border-white/5 flex flex-col shrink-0 overflow-hidden">
            <div className="p-6 flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-white">Friends</h1>
                    <button className="p-2 bg-blue-600/10 text-blue-500 rounded-lg hover:bg-blue-600/20 transition-all">
                        <UserPlus className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative mb-8">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search for new friends"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/30 transition-all"
                    />
                </div>

                {/* Pending Requests Section */}
                {pendingRequests.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pending Requests</h2>
                            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {pendingRequests.length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {pendingRequests.map((request) => (
                                <div key={request._id} className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                                        <img src={request.sender.avatar} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-white truncate">{request.sender.fullName}</p>
                                        <p className="text-[10px] text-gray-500 truncate">@{request.sender.username}</p>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <button 
                                            onClick={() => handleAccept(request._id)}
                                            className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                                        >
                                            <UserCheck className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleReject(request._id)}
                                            className="p-1.5 bg-white/5 text-red-500 rounded-lg hover:bg-white/10 transition-colors"
                                        >
                                            <UserX className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Friends List */}
                <div className="flex-1 overflow-y-auto">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">All Friends ({friends.length})</h2>
                    {friends.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Users className="w-12 h-12 text-gray-800 mb-4" />
                            <p className="text-sm text-gray-600">No friends yet. Start adding people!</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {friends.map((friend) => (
                                <div key={friend._id} className="p-3 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-all cursor-pointer group">
                                    <div className="relative">
                                        <div className="w-11 h-11 rounded-2xl overflow-hidden border border-white/5 group-hover:border-blue-500/30 transition-colors">
                                            <img src={friend.avatar} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#0a0a0a] rounded-full"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-gray-200 truncate">{friend.fullName}</h3>
                                        <p className="text-[10px] text-gray-500 truncate">Available</p>
                                    </div>
                                    <button className="p-2 text-gray-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                                        <Clock className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FriendsPanel;
