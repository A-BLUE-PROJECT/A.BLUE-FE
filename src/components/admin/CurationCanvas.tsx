'use client';

import { useAdminStore } from '@/store/useAdminStore';
import { clsx } from 'clsx';
import { useState, useMemo, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import type { LookbookDetailResponse } from '@/types/lookbook';

export function CurationCanvas() {
  const lookbooks = useAdminStore((state) => state.lookbooks);
  const filterStatus = useAdminStore((state) => state.filterStatus);
  const minAiScore = useAdminStore((state) => state.minAiScore);
  const loading = useAdminStore((state) => state.loading);
  const { selectedLookbookId, setSelectedLookbookId, updateLookbookStatus, fetchLookbooks } = useAdminStore();

  const [detail, setDetail] = useState<LookbookDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    fetchLookbooks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 선택된 룩북 상세 fetch
  useEffect(() => {
    if (selectedLookbookId === null) { setDetail(null); return; }
    setDetail(null);
    setDetailLoading(true);
    apiClient.get<LookbookDetailResponse>(`/adm/v1/lookbooks/${selectedLookbookId}`)
      .then((res) => setDetail(res.data))
      .catch(() => setDetail(null))
      .finally(() => setDetailLoading(false));
  }, [selectedLookbookId]);

  const filteredLookbooks = useMemo(() => {
    return lookbooks.filter((lb) => {
      const matchScore = lb.aiScore >= minAiScore;
      return matchScore;
    });
  }, [lookbooks, minAiScore]);

  const selectedLookbook = lookbooks.find((lb) => lb.id === selectedLookbookId);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    setProcessingId(id);
    await updateLookbookStatus(id, action);
    setProcessingId(null);
  };

  return (
    <div className="flex-1 flex bg-[#F5F5F5] h-[calc(100vh-64px)] overflow-hidden relative">

      {/* Gallery Grid */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Total Results: <span className="text-lime-600">{filteredLookbooks.length}</span>
            </h1>
            <p className="text-sm text-zinc-500 mt-1">Select a lookbook to review details and approve.</p>
          </div>
        </div>

        {loading ? (
          <div className="w-full h-64 flex items-center justify-center">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        ) : filteredLookbooks.length === 0 ? (
          <div className="w-full h-64 flex items-center justify-center text-zinc-400 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
            No lookbooks matching the given criteria.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-1">
            {filteredLookbooks.map((lb) => (
              <div
                key={lb.id}
                onClick={() => setSelectedLookbookId(lb.id)}
                className={clsx(
                  "group relative rounded-2xl overflow-hidden bg-white shadow-sm cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ring-1",
                  selectedLookbookId === lb.id ? "ring-lime-500 ring-2 shadow-lg" : "ring-black/5"
                )}
              >
                <div className="aspect-3/4 relative bg-zinc-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={lb.imageUrl} alt={lb.title} className="object-cover w-full h-full" />

                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={clsx(
                      "px-2 py-1 rounded-md text-[10px] font-bold tracking-wider",
                      lb.status === 'PENDING' ? "bg-amber-100 text-amber-700" :
                      lb.status === 'APPROVED' ? "bg-lime-100 text-lime-700" :
                      "bg-rose-100 text-rose-700"
                    )}>
                      {lb.status}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1">
                    <span className="text-lime-400 text-[10px]">✨</span>
                    <span className="text-white text-[10px] font-bold">{lb.aiScore}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm truncate">{lb.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{new Date(lb.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Detail Panel */}
      <div className={clsx(
        "bg-white border-l border-zinc-200 h-full flex flex-col shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-10",
        selectedLookbook ? "w-[400px] translate-x-0" : "w-0 translate-x-full overflow-hidden"
      )}>
        {selectedLookbook && (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <h2 className="font-bold text-lg">Review Lookbook</h2>
              <button
                onClick={() => setSelectedLookbookId(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 flex items-center justify-center transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              <div className="w-full aspect-3/4 bg-zinc-100 rounded-xl overflow-hidden relative ring-1 ring-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedLookbook.imageUrl} alt="preview" className="object-cover w-full h-full" />
              </div>

              <div>
                <h3 className="text-xl font-bold">{selectedLookbook.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="bg-zinc-900 text-white rounded-md px-2 py-1 text-xs font-semibold">
                    Score: {selectedLookbook.aiScore}
                  </span>
                  <span className="text-xs text-zinc-500">ID: {selectedLookbook.id}</span>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-6">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Linked Products</h4>
                {detailLoading ? (
                  <div className="flex gap-1.5 justify-center py-4">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                ) : detail?.items.length ? (
                  <div className="flex flex-col gap-3">
                    {detail.items.map((prod) => (
                      <div key={prod.productId} className="flex gap-3 items-center p-3 rounded-xl border border-zinc-100 hover:border-zinc-300 transition-colors">
                        <div className="w-12 h-12 bg-zinc-100 rounded-lg overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={prod.productImageUrl} alt={prod.productName} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-zinc-400 font-semibold">{prod.brandName}</p>
                          <p className="text-sm font-semibold truncate text-zinc-800">{prod.productName}</p>
                          <p className="text-xs text-lime-600 font-medium">₩ {prod.price.toLocaleString()}</p>
                        </div>
                        <a href={prod.originUrl} target="_blank" rel="noopener noreferrer"
                           className="text-[10px] text-zinc-400 hover:text-zinc-600 shrink-0 px-2 py-1 rounded border border-zinc-200 hover:border-zinc-400 transition-colors">
                          보기
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 text-center py-4">연결된 상품 없음</p>
                )}
              </div>
            </div>

            {selectedLookbook.status === 'PENDING' && (
              <div className="p-6 border-t border-zinc-100 bg-white grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAction(selectedLookbook.id, 'reject')}
                  disabled={processingId === selectedLookbook.id}
                  className="w-full py-4 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors disabled:opacity-50"
                >
                  REJECT
                </button>
                <button
                  onClick={() => handleAction(selectedLookbook.id, 'approve')}
                  disabled={processingId === selectedLookbook.id}
                  className="w-full py-4 rounded-xl text-sm font-bold text-zinc-900 bg-lime-400 hover:bg-lime-500 shadow-lg shadow-lime-500/20 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {processingId === selectedLookbook.id ? (
                    <span className="animate-spin text-lg">⚙️</span>
                  ) : "APPROVE"}
                </button>
              </div>
            )}

            {selectedLookbook.status !== 'PENDING' && (
              <div className="p-6 border-t border-zinc-100 bg-zinc-50 text-center">
                <p className="text-sm font-medium text-zinc-600">
                  This lookbook is already <span className="font-bold">{selectedLookbook.status}</span>.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
