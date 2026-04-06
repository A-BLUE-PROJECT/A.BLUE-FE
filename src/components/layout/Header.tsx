"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { openLoginModal } = useUIStore();
  const { user, fetchMe, logout } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 w-full text-black dark:text-white ${
        scrolled 
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-md py-4 border-b border-black/5 dark:border-white/5 shadow-sm" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <Link
          href="/"
          className="font-black text-xl md:text-2xl tracking-tighter uppercase cursor-pointer hover:opacity-70 transition-opacity"
        >
          ALL BLUE
        </Link>
        
        {/* Right: Minimal Nav */}
        <nav className="flex items-center gap-6 md:gap-8 text-[11px] md:text-sm font-bold tracking-widest uppercase">
          {user ? (
            <button onClick={logout} className="hover:underline underline-offset-8 decoration-2 transition-all">
              LOG OUT
            </button>
          ) : (
            <button onClick={openLoginModal} className="hover:underline underline-offset-8 decoration-2 transition-all">
              LOG IN
            </button>
          )}
          
          {/* Dropdown Menu Container */}
          <div className="relative group py-4 -my-4">
            <button className="hover:underline underline-offset-8 decoration-2 transition-all">
              MENU
            </button>
            
            {/* Hover Dropdown */}
            <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out">
              <div className="flex flex-col gap-4 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md py-4 px-5 rounded-xl shadow-2xl border border-black/5 dark:border-white/10 whitespace-nowrap text-right">
                <Link href="/" className="text-sm font-black tracking-widest hover:text-blue-600 dark:hover:text-blue-400 transition-colors">HOME</Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
