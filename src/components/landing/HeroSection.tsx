"use client";

import { useImagePreloader } from "@/hooks/useImagePreloader";
import { Lookbook } from "@/types/lookbook";
import OrchestrationContainer from "@/components/animation/OrchestrationContainer";
import MagazineGrid from "@/components/landing/MagazineGrid";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Mock Data
const mockLookbook: Lookbook = {
  id: "lb-001",
  title: "Avant-Garde Noir",
  resultImage: "/images/look_top_1.png",
  items: [
    {
      id: "prod-1",
      name: "Minimalist Trench",
      brand: "ZARA",
      image: "/images/look_bottom_4.png",
      initialPosition: { x: -30, y: -25, rotate: -15 },
    },
    {
      id: "prod-2",
      name: "Architectural Suit",
      brand: "COS",
      image: "/images/look_bottom_5.png",
      initialPosition: { x: 35, y: -15, rotate: 10 },
    },
    {
      id: "prod-3",
      name: "Sleeveless Black Dress",
      brand: "MASSIMO DUTTI",
      image: "/images/look_bottom_1.png",
      initialPosition: { x: -25, y: 30, rotate: -10 },
    },
    {
      id: "prod-4",
      name: "Dark Overcoat",
      brand: "MUSINSA STANDARD",
      image: "/images/look_bottom_2.png",
      initialPosition: { x: 30, y: 35, rotate: 20 },
    },
  ],
};

export default function HeroSection() {
  const imagesToLoad = mockLookbook.items.length + 1; // items + result image
  const { isLoaded, handleImageLoad } = useImagePreloader(imagesToLoad);

  return (
    <>
      {/* 
        This is a hidden div specifically for preloading Next.js images to accurately track onLoad events 
        before starting the Orchestration Animation.
      */}
      <div className="overflow-hidden h-0 w-0 absolute">
        <Image src={mockLookbook.resultImage} alt="" width={10} height={10} priority onLoad={handleImageLoad} />
        {mockLookbook.items.map((item) => (
          <Image key={item.id} src={item.image} alt="" width={10} height={10} priority onLoad={handleImageLoad} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!isLoaded ? (
          // Loading Skeleton / Skeleton Pulse
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 text-white"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 border-t-2 border-white rounded-full animate-spin" />
              <div className="text-sm font-bold tracking-widest uppercase animate-pulse">
                Orchestrating Style...
              </div>
            </div>
          </motion.div>
        ) : (
          // Main Content
          <motion.div
            key="orchestration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full"
          >
            <MagazineGrid />
            <OrchestrationContainer lookbook={mockLookbook} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
