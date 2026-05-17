"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { loginUser, registerUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { HiMusicalNote, HiEnvelope, HiLockClosed, HiUser } from "react-icons/hi2";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = isLogin
        ? await loginUser({ email, password })
        : await registerUser({ username, email, password });
      login(res.data.token, res.data.user);
      toast.success(isLogin ? "Welcome back!" : "Account created!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-sky-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
            <HiMusicalNote className="text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isLogin ? "Welcome Back" : "Join SonicWave"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isLogin ? "Sign in to continue listening" : "Create your free account"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 space-y-4">
          {!isLogin && (
            <div className="relative">
              <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
                placeholder="Username" className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          )}
          <div className="relative">
            <HiEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="Email address" className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <div className="relative">
            <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
              placeholder="Password" className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <motion.button type="submit" disabled={loading}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-sky-400 text-white font-semibold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all text-sm">
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </motion.button>
        </form>

        {/* Toggle */}
        <p className="text-center text-sm text-slate-500 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-500 font-semibold hover:underline">
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
