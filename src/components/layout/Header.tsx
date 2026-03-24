"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUIStore } from "@/store/useUIStore";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { openLoginModal, toggleMenu, isMenuOpen } = useUIStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 text-white ${
        scrolled && !isMenuOpen ? "bg-black/20 dark:bg-black/40 backdrop-blur-md py-4 border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between mix-blend-difference">
        {/* Left: Brand Identity */}
        <Link
          href="/"
          onClick={() => isMenuOpen && toggleMenu()}
          className="font-black text-xl md:text-2xl tracking-tighter uppercase cursor-pointer hover:opacity-70 transition-opacity"
        >
          ALL BLUE
        </Link>
        
        {/* Right: Minimal Nav */}
        <nav className="flex items-center gap-6 md:gap-8 text-[11px] md:text-sm font-bold tracking-widest uppercase">
          <button onClick={openLoginModal} className="hover:underline underline-offset-8 decoration-2 transition-all">
            LOG IN
          </button>
          <button onClick={toggleMenu} className="hover:underline underline-offset-8 decoration-2 transition-all">
            {isMenuOpen ? "CLOSE" : "MENU"}
          </button>
        </nav>
      </div>
    </header>
  );
}
