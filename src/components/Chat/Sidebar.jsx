import React from "react";
import { 
    MessageSquare, 
    Users, 
    User, 
    Settings, 
    Bell, 
    LogOut, 
    Moon, 
    Sun,
    Globe,
    Zap
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../../store/slices/authSlice";
import { toast } from "react-hot-toast";

const Sidebar = ({ activeTab, setActiveTab }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(clearAuth());
        toast.success("Logged out successfully");
    };

    const navItems = [
        { id: "profile", icon: User, label: "Profile" },
        { id: "chats", icon: MessageSquare, label: "Chats" },
        { id: "friends", icon: Users, label: "Friends" },
        { id: "notifications", icon: Bell, label: "Notifications" },
        { id: "settings", icon: Settings, label: "Settings" },
    ];

    return (
        <div className="w-[75px] h-screen bg-[#111] border-r border-white/5 flex flex-col items-center py-6 justify-between shrink-0">
            {/* Logo */}
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 mb-8 cursor-pointer hover:scale-105 transition-transform">
                <Zap className="w-6 h-6 text-white" />
            </div>

            {/* Navigation */}
            <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`p-3 rounded-2xl transition-all relative group ${
                            activeTab === item.id 
                                ? "bg-blue-600/10 text-blue-500" 
                                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                        }`}
                        title={item.label}
                    >
                        <item.icon className="w-6 h-6" />
                        {activeTab === item.id && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-l-full"></div>
                        )}
                        <span className="absolute left-full ml-4 px-2 py-1 bg-white text-black text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-4 items-center">
                <button className="p-3 rounded-2xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all">
                    <Globe className="w-6 h-6" />
                </button>
                <button className="p-3 rounded-2xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all">
                    <Moon className="w-6 h-6" />
                </button>
                <div className="h-px w-8 bg-white/5 my-2"></div>
                <button 
                    onClick={handleLogout}
                    className="p-3 rounded-2xl text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    title="Logout"
                >
                    <LogOut className="w-6 h-6" />
                </button>
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 mt-4 cursor-pointer hover:border-blue-500/50 transition-colors">
                    <img 
                        src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
