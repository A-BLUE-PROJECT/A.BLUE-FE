"use client";

import { useState, useCallback, useEffect } from "react";

export function useImagePreloader(totalImages: number) {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setLoadedCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    // Force loaded if all images trigger onLoad
    if (loadedCount >= totalImages && totalImages > 0) {
      setIsLoaded(true);
    }
  }, [loadedCount, totalImages]);

  // Fallback in case images are cached and onLoad doesn't fire for some reason
  // We'll give it a max 3 seconds timeout to prevent infinite loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return { isLoaded, handleImageLoad, loadedCount };
}
