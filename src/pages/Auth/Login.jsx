import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import authService from "../../services/auth.api";
import { setAuth, setLoading, setError } from "../../store/slices/authSlice";

const Login = () => {
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const { loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.identifier || !formData.password) {
            return toast.error("Please fill in all fields");
        }

        dispatch(setLoading(true));
        try {
            const data = await authService.login(formData);
            dispatch(setAuth(data.data.user));
            toast.success("Welcome back to Lumo!");
            navigate("/");
        } catch (error) {
            const message = error.response?.data?.message || "Login failed";
            dispatch(setError(message));
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#050505] text-white selection:bg-blue-500/30">
            {/* Left Side: Hero/Illustration (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden border-r border-white/5">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[120px]"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                </div>

                <div className="relative z-10 p-12 max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">Lumo</span>
                        </div>
                        <h1 className="text-5xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-white/40">
                            Connect with the world in real-time.
                        </h1>
                        <p className="text-lg text-gray-400 mb-10 leading-relaxed">
                            Experience the next generation of messaging. Secure, fast, and beautiful. Join thousands of users worldwide.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { icon: ShieldCheck, title: "Secure", desc: "End-to-end encryption" },
                                { icon: Sparkles, title: "Premium", desc: "Tailored experience" },
                            ].map((item, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <item.icon className="w-6 h-6 text-blue-500 mb-2" />
                                    <h3 className="font-semibold text-white">{item.title}</h3>
                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute bottom-10 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="absolute inset-0 lg:hidden z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[80px]"></div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md z-10"
                >
                    <div className="lg:hidden flex items-center gap-2 mb-12 justify-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Lumo</span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
                        <p className="text-gray-500">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Email or Username</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    name="identifier"
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    placeholder="Email or username"
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

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input type="checkbox" className="peer sr-only" />
                                    <div className="w-5 h-5 bg-[#111] border border-white/10 rounded-md peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 left-1 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">Remember me</span>
                            </label>
                            <Link to="/forgot-password" title="Forgot Password" className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-white/5"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-500">
                            New to Lumo?{" "}
                            <Link to="/register" title="Sign Up" className="text-white font-bold hover:underline decoration-blue-500 decoration-2 underline-offset-4 transition-all">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
