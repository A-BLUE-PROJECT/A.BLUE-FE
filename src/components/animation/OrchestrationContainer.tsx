"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Lookbook } from "@/types/lookbook";

export default function OrchestrationContainer({ lookbook }: { lookbook: Lookbook }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress of the 300vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Stage 1: (0.0 to 0.2) Just floating loosely via CSS/Framer
  // Stage 2: (0.2 to 0.8) Sucking into the center
  const pullProgress = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);
  // Stage 3: (0.8 to 1.0) Reveal final lookbook and text
  const resultOpacity = useTransform(scrollYProgress, [0.8, 1.0], [0, 1]);
  const resultScale = useTransform(scrollYProgress, [0.8, 1.0], [0.9, 1]);

  return (
    <div ref={containerRef} className="relative w-full h-[300vh] bg-zinc-950 text-white">
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center perspective-1000">
        
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,transparent_60%)]" />

        {/* The Final Lookbook Base (hidden until 80%) */}
        <motion.div
          style={{
            opacity: resultOpacity,
            scale: resultScale,
          }}
          className="absolute z-20 w-[80vw] md:w-[400px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        >
          <Image
            src={lookbook.resultImage}
            alt={lookbook.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-3xl font-black uppercase tracking-tight">{lookbook.title}</h2>
            <p className="text-zinc-400 text-sm tracking-wide">Mix Malls, Match Your Style</p>
          </div>
        </motion.div>

        {/* Scattered "Ingredients" / Products */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {lookbook.items.map((item, index) => {
            // Map the individual pull progress to transform the initial position to center (0,0)
            const x = useTransform(pullProgress, [0, 1], [`${item.initialPosition.x}vw`, "0vw"]);
            const y = useTransform(pullProgress, [0, 1], [`${item.initialPosition.y}vh`, "0vh"]);
            const rotate = useTransform(pullProgress, [0, 1], [item.initialPosition.rotate, 0]);
            const scale = useTransform(pullProgress, [0, 1], [1, 0.2]); // shrink as they converge
            const opacity = useTransform(pullProgress, [0, 0.9, 1], [1, 0.5, 0]); // fade out when converged

            return (
              <motion.div
                key={item.id}
                style={{
                  x,
                  y,
                  rotate,
                  scale,
                  opacity,
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 aspect-[3/4] bg-zinc-900 rounded-xl overflow-hidden shadow-xl border border-white/5"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[10px] font-medium tracking-wider uppercase border border-white/10">
                  {item.brand}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Instructional Scroll Down Text */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          className="absolute bottom-10 z-30 flex flex-col items-center animate-pulse text-zinc-500"
        >
          <span className="text-xs tracking-widest uppercase mb-2">Scroll To Discover</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-500 to-transparent" />
        </motion.div>

      </div>
    </div>
  );
}
