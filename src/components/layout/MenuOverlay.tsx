"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import Link from "next/link";

export default function MenuOverlay() {
  const { isMenuOpen, closeMenu } = useUIStore();

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
          animate={{ opacity: 1, clipPath: "circle(150% at 100% 0)" }}
          exit={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[90] bg-zinc-950 text-white flex justify-center items-center"
        >
          {/* Ambient anti-gravity background glow */}
          <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
          
          <nav className="flex flex-col gap-6 md:gap-10 text-center relative z-10 w-full group">
            <Link 
              href="/" 
              onClick={closeMenu}
              className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-white hover:text-white transition-all duration-300"
            >
              Home
            </Link>
            <Link 
              href="/gallery" 
              onClick={closeMenu}
              className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-zinc-600 hover:text-white hover:scale-105 transition-all duration-300"
            >
              Gallery
            </Link>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
