"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setTheme("light");
      document.body.classList.add("light-mode");
    } else {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.classList.toggle("light-mode");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
      title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-900" />}
    </button>
  );
}
