"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "../../../lib/auth";
import { BookOpen, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="w-full max-w-[480px] animate-fade-in">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
           <div className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-xl mb-4">
              <BookOpen className="h-8 w-8 text-white" />
           </div>
           <h1 className="text-3xl font-extrabold text-white tracking-tight">EduFlow</h1>
           <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="auth-card">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <div className="auth-input-group">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-container">
                <Mail className="auth-icon" />
                <input 
                  type="email" 
                  className="auth-input" 
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-input-group">
              <div className="flex justify-between items-center w-full">
                <label className="auth-label">Password</label>
                <Link href="#" className="text-xs font-bold text-purple-400 hover:text-purple-300">Forgot?</Link>
              </div>
              <div className="auth-input-container">
                <Lock className="auth-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="auth-input" 
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <p className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-white font-bold hover:text-purple-400 transition-colors">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
