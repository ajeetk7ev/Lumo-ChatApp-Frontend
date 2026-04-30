import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserPlus, Mail, Lock, User, Camera, Loader2, Eye, EyeOff, Zap, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import authService from "../../services/auth.api";
import { setAuth, setLoading, setError } from "../../store/slices/authSlice";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        fullName: "",
    });
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const fileInputRef = useRef(null);
    
    const { loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                return toast.error("Avatar must be less than 2MB");
            }
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password || !formData.fullName) {
            return toast.error("Please fill in all required fields");
        }

        const dataToSend = new FormData();
        dataToSend.append("username", formData.username);
        dataToSend.append("email", formData.email);
        dataToSend.append("password", formData.password);
        dataToSend.append("fullName", formData.fullName);
        if (avatar) {
            dataToSend.append("avatar", avatar);
        }

        dispatch(setLoading(true));
        try {
            const data = await authService.register(dataToSend);
            dispatch(setAuth(data.data.user));
            toast.success("Account created! Welcome to the family.");
            navigate("/");
        } catch (error) {
            const message = error.response?.data?.message || "Registration failed";
            dispatch(setError(message));
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#050505] text-white selection:bg-blue-500/30">
            {/* Left Side: Illustration (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden border-r border-white/5">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[120px]"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                </div>

                <div className="relative z-10 p-12 max-w-xl text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-2 mb-8 justify-center lg:justify-start">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">Lumo</span>
                        </div>
                        <h1 className="text-5xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-white/40">
                            Build your profile, start chatting.
                        </h1>
                        
                        <ul className="space-y-4 mb-10">
                            {[
                                "Real-time global connectivity",
                                "Customizable profile & avatars",
                                "End-to-end secure messaging",
                                "Community driven platform"
                            ].map((text, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-400">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                    <span>{text}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-gray-800">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" className="w-full h-full rounded-full" />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-400">Joined by <span className="text-white font-bold">2,000+</span> users this week</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative overflow-y-auto">
                <div className="absolute inset-0 lg:hidden z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[80px]"></div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-lg z-10 py-10"
                >
                    <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Lumo</span>
                    </div>

                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-3xl font-bold mb-2">Create an account</h2>
                        <p className="text-gray-500">Sign up in less than 2 minutes.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center lg:items-start gap-4 mb-6">
                            <div 
                                className="relative group cursor-pointer"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <div className="w-24 h-24 rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden bg-[#111] group-hover:border-blue-500/50 transition-all">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Camera className="w-8 h-8 text-gray-600 group-hover:text-blue-500 transition-colors" />
                                    )}
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-xl shadow-lg border-4 border-[#050505]">
                                    <UserPlus className="w-3 h-3 text-white" />
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleAvatarChange} 
                                    className="hidden" 
                                    accept="image/*"
                                />
                            </div>
                            <div className="text-center lg:text-left">
                                <h4 className="text-sm font-medium text-gray-300">Profile Photo</h4>
                                <p className="text-xs text-gray-500">JPG, PNG up to 2MB</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full bg-[#111] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Username</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors font-bold">@</span>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="johndoe"
                                        className="w-full bg-[#111] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="hello@lumo.com"
                                    className="w-full bg-[#111] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-[#111] border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
                            <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
                            <p className="text-xs text-gray-500 leading-relaxed">
                                By signing up, you agree to our <span className="text-white cursor-pointer hover:underline">Terms of Service</span> and <span className="text-white cursor-pointer hover:underline">Privacy Policy</span>.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-white/5 mt-2"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Create Account"}
                        </button>
                    </form>

                    <div className="mt-8 text-center lg:text-left">
                        <p className="text-gray-500 font-medium">
                            Already have an account?{" "}
                            <Link to="/login" title="Sign In" className="text-white font-bold hover:underline decoration-blue-500 decoration-2 underline-offset-4 transition-all">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
