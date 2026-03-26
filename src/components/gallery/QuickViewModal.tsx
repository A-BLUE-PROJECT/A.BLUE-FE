"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

// Mock products for the quick view if not provided by lookbook
const MOCK_PRODUCTS = [
  { id: 1, name: "Over-dyed Minimal Jacket", brand: "A.BLUE EDITION", price: "₩ 145,000", image: "/images/look_bottom_1.png" },
  { id: 2, name: "Wide Parachute Pants", brand: "A.BLUE EDITION", price: "₩ 89,000", image: "/images/look_bottom_2.png" },
  { id: 3, name: "Chunky Canvas Sneakers", brand: "COMMON PROJECTS", price: "₩ 450,000", image: "/images/look_bottom_4.png" }
];

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  }
};

export default function QuickViewModal() {
  const { 
    isQuickViewOpen, 
    closeQuickView, 
    quickViewLookbooks, 
    quickViewIndex, 
    quickViewDirection,
    nextQuickView,
    prevQuickView
  } = useUIStore();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isQuickViewOpen) return;
      if (e.key === "ArrowRight") nextQuickView();
      if (e.key === "ArrowLeft") prevQuickView();
      if (e.key === "Escape") closeQuickView();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isQuickViewOpen, nextQuickView, prevQuickView, closeQuickView]);

  const selectedLookbook = quickViewLookbooks?.[quickViewIndex];

  if (!selectedLookbook && isQuickViewOpen) {
    return null;
  }

  const hasNext = quickViewIndex < quickViewLookbooks.length - 1;
  const hasPrev = quickViewIndex > 0;

  return (
    <AnimatePresence>
      {isQuickViewOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
            className="fixed inset-0 z-200 bg-zinc-950/80 backdrop-blur-xl"
          />

          {/* Wrapper to control fixed layout and let inner motion.divs slide around */}
          <div className="fixed bottom-0 md:top-1/2 left-0 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-210 w-full md:w-[90%] md:max-w-5xl md:h-[80vh] h-[90vh] pointer-events-none">
            
            {/* Nav Arrows */}
            <div className="absolute inset-y-0 -left-4 md:-left-20 flex items-center pointer-events-auto z-50">
              <AnimatePresence>
                {hasPrev && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    onClick={(e) => { e.stopPropagation(); prevQuickView(); }}
                    className="p-3 bg-white text-black hover:bg-zinc-200 rounded-full shadow-2xl transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            
            <div className="absolute inset-y-0 -right-4 md:-right-20 flex items-center pointer-events-auto z-50">
              <AnimatePresence>
                {hasNext && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    onClick={(e) => { e.stopPropagation(); nextQuickView(); }}
                    className="p-3 bg-white text-black hover:bg-zinc-200 rounded-full shadow-2xl transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Close Button above the container */}
            <button
              onClick={closeQuickView}
              className="absolute -top-12 md:-top-16 right-4 md:right-0 z-50 p-2 md:p-3 bg-black/50 backdrop-blur-md rounded-full text-white/70 hover:text-white border border-white/10 transition-colors pointer-events-auto"
            >
              <X className="w-5 h-5 md:w-8 md:h-8" />
            </button>

            {/* Slide Container */}
            <div className="relative w-full h-full overflow-hidden md:rounded-3xl rounded-t-3xl shadow-2xl bg-zinc-900 pointer-events-auto border-t md:border border-white/10">
              <AnimatePresence initial={false} custom={quickViewDirection}>
                <motion.div
                  key={quickViewIndex}
                  custom={quickViewDirection}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute inset-0 w-full h-full flex flex-col md:flex-row bg-zinc-900"
                >
                  {/* Left/Top: Main Lookbook Image */}
                  <div className="relative w-full h-[40%] md:h-full md:w-1/2 bg-black shrink-0">
                    <Image
                      src={selectedLookbook?.src || "/images/look_top_1.png"}
                      alt="Lookbook Item"
                      fill
                      className="object-cover opacity-90 grayscale"
                      priority
                    />
                    <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 bg-black/60 backdrop-blur-md px-4 py-2 border border-white/10 rounded-full flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-[pulse_2s_ease-in-out_infinite]" />
                      <span className="text-white text-xs font-black tracking-widest uppercase">
                        Synergy {selectedLookbook?.score || 95}%
                      </span>
                    </div>
                  </div>

                  {/* Right/Bottom: Product List */}
                  <div className="w-full h-[60%] md:h-full md:w-1/2 bg-zinc-950 flex flex-col pt-8 md:pt-12 px-6 pb-6 overflow-y-auto custom-scrollbar relative shrink-0">
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-2">
                        Style Composition
                      </h2>
                      <p className="text-zinc-400 text-sm tracking-widest uppercase">
                        {selectedLookbook?.tags?.join(", ") || "A.BLUE EDITORIAL"}
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 flex-1">
                      {MOCK_PRODUCTS.map((product) => (
                        <div key={product.id} className="group relative flex items-center gap-4 bg-zinc-900/50 hover:bg-zinc-800 transition-colors p-3 rounded-2xl border border-white/5">
                          <div className="relative w-20 h-24 md:w-24 md:h-28 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                            <Image src={product.image} alt={product.name} fill className="object-cover mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-300" />
                          </div>
                          
                          <div className="flex-1 flex flex-col justify-center">
                            <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mb-1">{product.brand}</span>
                            <h3 className="text-white font-medium text-sm md:text-base leading-tight mb-2 pr-4">{product.name}</h3>
                            <span className="text-blue-400 font-bold text-sm tracking-wide">{product.price}</span>
                          </div>

                          <div className="absolute right-4 md:right-6">
                            <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="sticky bottom-0 mt-8 pt-4 pb-2 bg-linear-to-t from-zinc-950 via-zinc-950 to-transparent">
                      <button className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] rounded-xl hover:bg-zinc-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        Add Full Look to Cart
                      </button>
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
