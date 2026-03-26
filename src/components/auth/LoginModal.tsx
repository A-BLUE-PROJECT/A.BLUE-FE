"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import { X } from "lucide-react";

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal } = useUIStore();

  const handleMockLogin = () => {
    // For MVP testing: Mock authentication explicitly to bypass middleware
    document.cookie = "next-auth.session-token=mock_token_123; path=/";
    window.location.href = "/admin/inspect";
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
                onClick={handleMockLogin}
                className="w-full bg-white text-black font-bold uppercase tracking-widest py-3.5 rounded-xl hover:bg-zinc-200 transition-colors shadow-lg"
              >
                Mock Google Login
              </button>
              <button 
                onClick={closeLoginModal}
                className="w-full bg-black/40 border border-white/10 text-white font-bold uppercase tracking-widest py-3.5 rounded-xl hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
            
            <div className="text-center mt-6 text-[10px] text-zinc-500 font-medium tracking-wide">
              * Logging in gives access to MVP Admin panel.
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
