"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "../../../lib/auth";
import { BookOpen, Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = () => {
    const pw = formData.password;
    if (!pw) return 0;
    let strength = 0;
    if (pw.length >= 8) strength++;
    if (/[A-Z]/.test(pw)) strength++;
    if (/[0-9]/.test(pw)) strength++;
    return strength;
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="w-full max-w-[500px] animate-fade-in">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
           <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-xl mb-4">
              <BookOpen className="h-8 w-8 text-white" />
           </div>
           <h1 className="text-3xl font-extrabold text-white tracking-tight">Join EduFlow</h1>
           <p className="text-slate-400 text-sm mt-1">Create your learner account</p>
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
              <label className="auth-label">Full Name</label>
              <div className="auth-input-container">
                <User className="auth-icon" />
                <input 
                  name="name"
                  type="text" 
                  className="auth-input" 
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-container">
                <Mail className="auth-icon" />
                <input 
                  name="email"
                  type="email" 
                  className="auth-input" 
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="auth-input-group mb-0">
                <label className="auth-label">Password</label>
                <div className="auth-input-container">
                  <Lock className="auth-icon" />
                  <input 
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    className="auth-input" 
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="auth-input-group mb-0">
                <label className="auth-label">Confirm</label>
                <div className="auth-input-container">
                  <Lock className="auth-icon" />
                  <input 
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"} 
                    className="auth-input" 
                    placeholder="••••••••"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Strength bar */}
            {formData.password && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1 text-[10px] uppercase font-bold text-slate-500">
                  <span>Security</span>
                  <span className={strength >= 3 ? 'text-green-500' : 'text-yellow-500'}>{strength >= 3 ? 'Strong' : 'Weak'}</span>
                </div>
                <div className="flex gap-1 h-1">
                  {[1,2,3,4].map(s => (
                    <div key={s} className={`flex-1 rounded-full transition-all ${strength >= s ? (strength >= 3 ? 'bg-green-500' : 'bg-yellow-500') : 'bg-white/10'}`}></div>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className="auth-button" disabled={loading} style={{ background: 'linear-gradient(to right, #4f46e5, #c026d3)' }}>
              {loading ? "Creating..." : "Create Account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <p className="text-slate-400 text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-white font-bold hover:text-indigo-400 transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
