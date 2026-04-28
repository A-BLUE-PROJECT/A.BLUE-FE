"use client";

import { motion } from "framer-motion";

import { useEffect, useRef, useState, useCallback } from "react";
import { useUIStore, type LookbookLight } from "@/store/useUIStore";
import { apiClient } from "@/lib/apiClient";
import type { CursorPage, LookbookResponse } from "@/types/lookbook";

function toLookbookLight(lb: LookbookResponse): LookbookLight {
  const tags = lb.tags ? lb.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  return {
    id: lb.id,
    src: lb.imageUrl,
    score: lb.aiScore ?? 0,
    tags,
  };
}

const getAspectClass = (index: number) => {
  const aspects = ["aspect-[3/4]", "aspect-[4/5]", "aspect-[2/3]", "aspect-square", "aspect-[3/5]"];
  return aspects[index % aspects.length];
};

export default function LookbookGrid() {
  const { openQuickView } = useUIStore();
  const [lookbooks, setLookbooks] = useState<LookbookLight[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchMore = useCallback(async () => {
    if (loading || !hasNext) return;
    setLoading(true);
    try {
      const path = cursor
        ? `/w/v1/lookbooks?cursor=${cursor}&size=20`
        : `/w/v1/lookbooks?size=20`;
      const res = await apiClient.get<CursorPage<LookbookResponse>>(path);
      const page = res.data;
      const newItems = page.items.map(toLookbookLight);
      setLookbooks((prev) => [...prev, ...newItems]);
      setHasNext(page.hasNext);
      if (page.items.length > 0) {
        setCursor(page.items[page.items.length - 1].id);
      }
    } catch {
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  }, [cursor, hasNext, loading]);

  // 최초 로드
  useEffect(() => {
    fetchMore();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 무한스크롤 — sentinel 감지
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) fetchMore(); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchMore]);

  if (!loading && lookbooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
        <p className="text-sm tracking-widest uppercase">No lookbooks yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
        {lookbooks.map((lb, idx) => {
          const heightClass = getAspectClass(idx);
          const orbitDuration = 10 + (idx % 5) * 2;
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
                <motion.div
                  whileHover={{ scale: 0.98, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  onClick={() => openQuickView(lookbooks, idx)}
                  className="relative w-full h-full bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 shadow-md cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={lb.src}
                    alt={`Lookbook ${lb.id}`}
                    className="object-cover object-top w-full h-full transition-all duration-700 ease-out"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {lb.tags.length > 0 && (
                    <div className="absolute bottom-6 left-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                      <div className="flex gap-2 flex-wrap">
                        {lb.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {lb.score > 0 && (
                    <div className="absolute top-1/2 left-1/2 w-[90%] max-w-[300px] aspect-square -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-[spin_60s_linear_infinite]" />
                      <motion.div
                        animate={{ rotate: isCounterClockwise ? -360 : 360 }}
                        transition={{ duration: orbitDuration, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0"
                      >
                        <motion.div
                          animate={{ rotate: isCounterClockwise ? 360 : -360 }}
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
                  )}
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* 무한스크롤 sentinel */}
      <div ref={sentinelRef} className="h-16 flex items-center justify-center">
        {loading && (
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
