"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import { X } from "lucide-react";

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal } = useUIStore();

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLoginModal}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[210] w-[90%] max-w-[400px] bg-zinc-900/60 dark:bg-black/60 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Ambient anti-gravity light */}
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-blue-500/20 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px] pointer-events-none" />
            
            <button
              onClick={closeLoginModal}
              className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-10 relative z-10 pt-4">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-2 mix-blend-overlay">ALL BLUE</h2>
              <p className="text-zinc-400 text-xs font-semibold tracking-[0.3em] uppercase">Orbit Access</p>
            </div>

            <div className="flex flex-col gap-4 relative z-10">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white text-[#1f1f1f] font-medium py-3.5 rounded-xl hover:bg-zinc-100 transition-colors shadow-lg border border-zinc-200"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                </svg>
                <span style={{ fontFamily: "Roboto, sans-serif", fontSize: "14px" }}>Continue with Google</span>
              </button>
              <button 
                onClick={closeLoginModal}
                className="w-full bg-black/40 border border-white/10 text-white font-bold uppercase tracking-widest py-3.5 rounded-xl hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
            
            <div className="text-center mt-6 text-[10px] text-zinc-500 font-medium tracking-wide">
              * Google 계정으로 로그인합니다.
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
