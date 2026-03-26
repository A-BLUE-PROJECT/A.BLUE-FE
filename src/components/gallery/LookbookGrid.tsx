"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useUIStore } from "@/store/useUIStore";

// Mock data (Deterministic to prevent Hydration mismatch)
const generateMockLookbooks = (page: number) => {
  return Array.from({ length: 12 }).map((_, i) => {
    const id = page * 100 + i;
    const images = [
      "/images/look_top_1.png",
      "/images/look_top_2.png",
      "/images/look_bottom_1.png",
      "/images/look_bottom_2.png",
      "/images/look_bottom_4.png",
      "/images/look_bottom_5.png",
    ];
    const allTags = ["Minimal", "Street", "Avant-Garde", "Casual", "Editorial"];
    
    return {
      id,
      src: images[id % images.length],
      score: 80 + (id % 20), // Deterministic score based on id
      tags: [allTags[id % allTags.length], allTags[(Math.floor(id * 1.5) + 1) % allTags.length]],
    };
  });
};

export default function LookbookGrid() {
  const lookbooks = generateMockLookbooks(1);
  const { openQuickView } = useUIStore();

  // Cycle through different aspect ratios to create a Pinterest masonry waterfall effect natively
  const getAspectClass = (index: number) => {
    const aspects = [
      "aspect-[3/4]",
      "aspect-[4/5]",
      "aspect-[2/3]",
      "aspect-square",
      "aspect-[3/5]",
    ];
    return aspects[index % aspects.length];
  };

  return (
    <div className="w-full columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
      {lookbooks.map((lb, idx) => {
        const heightClass = getAspectClass(idx);
        const orbitDuration = 10 + (idx % 5) * 2; // Randomize orbit speed
        const isCounterClockwise = idx % 2 === 0;

        return (
          <div key={lb.id} className="break-inside-avoid">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`relative group w-full ${heightClass}`}
            >
              {/* Anti-gravity container mapped cleanly inside masonry block */}
              <motion.div 
                whileHover={{ scale: 0.98, y: -5 }} 
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                onClick={() => openQuickView(lookbooks, idx)}
                className="relative w-full h-full bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 shadow-md cursor-pointer"
              >
                <Image
                  src={lb.src}
                  alt={`Lookbook ${lb.id}`}
                  fill
                  className="object-cover transition-all duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Lower Tags */}
                <div className="absolute bottom-6 left-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                  <div className="flex gap-2 flex-wrap">
                    {lb.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Synergy Orbit Badge */}
                <div className="absolute top-1/2 left-1/2 w-[90%] max-w-[300px] aspect-square -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {/* Visual Track */}
                  <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-[spin_60s_linear_infinite]" />
                  
                  <motion.div
                    animate={{ rotate: isCounterClockwise ? -360 : 360 }}
                    transition={{ duration: orbitDuration, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                  >
                    <motion.div 
                      animate={{ rotate: isCounterClockwise ? 360 : -360 }} // Keep upright
                      transition={{ duration: orbitDuration, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 bg-white dark:bg-zinc-950 px-3 py-1.5 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] border border-black/10 dark:border-white/10 flex items-center gap-1.5 pointer-events-auto"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-[pulse_2s_ease-in-out_infinite]" />
                      <span className="text-[10px] font-black tracking-widest uppercase text-zinc-900 dark:text-white whitespace-nowrap">
                        Synergy {lb.score}%
                      </span>
                    </motion.div>
                  </motion.div>
                </div>

              </motion.div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
