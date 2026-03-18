"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore } from "../../store/authStore";
import { logout } from "../../lib/auth";
import { ThemeToggle } from "../ThemeToggle";


export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/auth/login";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <header className="sticky top-0 z-[100] px-10 py-4 flex items-center justify-between bg-white/5 backdrop-blur-xl border-b border-white/10">
        {/* Logo */}
        <Link href="/" className="no-underline">
          <div className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
            📘 EduFlow
          </div>
        </Link>

        {/* Nav buttons */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 mr-2">
                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                   👤
                 </div>
                 <span className="text-sm font-medium text-white/80">{user?.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="px-5 py-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-full text-white/90 text-sm font-medium hover:bg-white/10 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <button className="px-5 py-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-full text-white/90 text-sm font-medium hover:bg-white/10 transition-all">
                  Login
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 border-none rounded-full text-white text-sm font-bold shadow-lg shadow-purple-500/20 hover:opacity-90 transition-all">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      </header>
      <main className="flex-grow relative">
        {children}
      </main>
    </div>
  );
};
