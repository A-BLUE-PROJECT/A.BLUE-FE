'use client';

import { useAdminStore } from '@/store/useAdminStore';
import { clsx } from 'clsx';
import { useState, useMemo } from 'react';

export function CurationCanvas() {
  const lookbooks = useAdminStore((state) => state.lookbooks);
  const filterStatus = useAdminStore((state) => state.filterStatus);
  const minAiScore = useAdminStore((state) => state.minAiScore);
  const { selectedLookbookId, setSelectedLookbookId, updateLookbookStatus } = useAdminStore();
  
  const filteredLookbooks = useMemo(() => {
    return lookbooks.filter((lb) => {
      const matchStatus = filterStatus === 'ALL' || lb.status === filterStatus;
      const matchScore = lb.aiScore >= minAiScore;
      return matchStatus && matchScore;
    });
  }, [lookbooks, filterStatus, minAiScore]);

  const [processingId, setProcessingId] = useState<string | null>(null);

  const selectedLookbook = filteredLookbooks.find((lb) => lb.id === selectedLookbookId);

  const handleAction = (id: string, action: 'APPROVED' | 'REJECTED') => {
    setProcessingId(id);
    // Simulate API delay
    setTimeout(() => {
      updateLookbookStatus(id, action);
      setProcessingId(null);
    }, 400);
  };

  return (
    <div className="flex-1 flex bg-[#F5F5F5] h-[calc(100vh-64px)] overflow-hidden relative">
      
      {/* Gallery Grid */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Total Results: <span className="text-lime-600">{filteredLookbooks.length}</span></h1>
            <p className="text-sm text-zinc-500 mt-1">Select a lookbook to review details and approve.</p>
          </div>
        </div>

        {filteredLookbooks.length === 0 ? (
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
                  
                  {/* Overlay Badges */}
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

      {/* Right Detail Panel (Review Mode) */}
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
                title="Close"
              >
                &times;
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {/* Image Preview */}
              <div className="w-full aspect-3/4 bg-zinc-100 rounded-xl overflow-hidden relative ring-1 ring-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedLookbook.imageUrl} alt="preview" className="object-cover w-full h-full" />
              </div>

              {/* Data */}
              <div>
                <h3 className="text-xl font-bold">{selectedLookbook.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="bg-zinc-900 text-white rounded-md px-2 py-1 text-xs font-semibold">
                    Score: {selectedLookbook.aiScore}
                  </span>
                  <span className="text-xs text-zinc-500">
                    ID: {selectedLookbook.id}
                  </span>
                </div>
              </div>

              {/* Related Products */}
              <div className="border-t border-zinc-100 pt-6">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Linked Cafe24 Products</h4>
                <div className="flex flex-col gap-3">
                  {selectedLookbook.relatedProducts.map((prod) => (
                    <div key={prod.productId} className="flex gap-3 items-center p-3 rounded-xl border border-zinc-100 hover:border-zinc-300 transition-colors">
                      <div className="w-12 h-12 bg-zinc-100 rounded-lg overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={prod.thumbnailUrl} alt={prod.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate text-zinc-800">{prod.name}</p>
                        <p className="text-xs text-lime-600 font-medium">₩ {prod.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {selectedLookbook.status === 'PENDING' && (
              <div className="p-6 border-t border-zinc-100 bg-white grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAction(selectedLookbook.id, 'REJECTED')}
                  disabled={processingId === selectedLookbook.id}
                  className="w-full py-4 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors disabled:opacity-50"
                >
                  REJECT
                </button>
                <button
                  onClick={() => handleAction(selectedLookbook.id, 'APPROVED')}
                  disabled={processingId === selectedLookbook.id}
                  className="w-full py-4 rounded-xl text-sm font-bold text-zinc-900 bg-lime-400 hover:bg-lime-500 shadow-lg shadow-lime-500/20 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {processingId === selectedLookbook.id ? (
                    <span className="animate-spin text-lg">⚙️</span>
                  ) : (
                    "APPROVE"
                  )}
                </button>
              </div>
            )}
            
            {/* If Already Processed */}
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
