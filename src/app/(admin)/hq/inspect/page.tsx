"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { StatusToggle } from "@/components/admin/StatusToggle";
import { apiClient } from "@/lib/apiClient";
import type { LookbookResponse } from "@/types/lookbook";

interface PendingItem {
  id: number;
  src: string;
  aiTags: string[];
}

function mapToItem(lb: LookbookResponse): PendingItem {
  return {
    id: lb.id,
    src: lb.imageUrl,
    aiTags: lb.tags ? lb.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
  };
}

export default function AdminDashboard() {
  const [lookbooks, setLookbooks] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<LookbookResponse[] | { items: LookbookResponse[] }>("/adm/v1/lookbooks?status=COMPLETED")
      .then((res) => {
        const raw = Array.isArray(res.data) ? res.data : res.data.items;
        setLookbooks(raw.map(mapToItem));
      })
      .catch(() => setLookbooks([]))
      .finally(() => setLoading(false));
  }, []);

  const remove = (id: number) =>
    setLookbooks((prev) => prev.filter((lb) => lb.id !== id));

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 p-8 md:p-12 font-sans text-zinc-900 dark:text-zinc-100">
      <header className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Curation Inspector</h1>
          <p className="text-zinc-500 mt-2">AI 생성이 완료된 룩북을 검수하고 메인 갤러리에 게시합니다.</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-medium">{lookbooks.length}</span>
          <span className="text-zinc-500 ml-2">Pending</span>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {lookbooks.map((lb) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                key={lb.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col"
              >
                <div className="relative aspect-[4/5] w-full bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={lb.src}
                    alt={`Pending Lookbook ${lb.id}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                      PENDING (AI)
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm text-zinc-500 uppercase tracking-widest font-semibold mb-2">Detected Styles</h3>
                    <div className="flex gap-2 mb-6 flex-wrap">
                      {lb.aiTags.length > 0 ? lb.aiTags.map((tag) => (
                        <span key={tag} className="text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
                          {tag}
                        </span>
                      )) : (
                        <span className="text-xs text-zinc-400">—</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <StatusToggle lookbookId={lb.id} onDone={() => remove(lb.id)} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {lookbooks.length === 0 && (
            <div className="col-span-full py-20 text-center text-zinc-500">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-zinc-300 dark:text-zinc-700" />
              <p className="text-xl">All caught up!</p>
              <p>No more pending lookbooks to review.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
