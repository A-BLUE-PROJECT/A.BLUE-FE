'use client';

import { useProductStore } from '@/store/useProductStore';
import { clsx } from 'clsx';

export function ProductFilters() {
  const { hideOutOfStock, setHideOutOfStock, searchQuery, setSearchQuery, isSyncing, syncNow } = useProductStore();

  return (
    <div className="bg-white px-8 py-5 border-b border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      {/* Search & Toggles */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">🔍</span>
          <input
            type="text"
            placeholder="Search products by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-64 md:w-[260px] text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer group" onClick={() => setHideOutOfStock(!hideOutOfStock)}>
          <div className={clsx(
            "w-8 h-4 rounded-full transition-colors relative",
            hideOutOfStock ? "bg-lime-500" : "bg-zinc-200"
          )}>
            <div className={clsx(
              "absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform shadow-sm",
              hideOutOfStock ? "translate-x-4" : "translate-x-0"
            )} />
          </div>
          <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900 transition-colors">
            Hide Out of Stock (0)
          </span>
        </label>
      </div>

      {/* Sync Button */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Cafe24 Endpoint</p>
          <p className="text-xs text-lime-600 font-bold flex items-center justify-end gap-1">
            <span className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-pulse"></span> Connected
          </p>
        </div>
        <button
          onClick={syncNow}
          disabled={isSyncing}
          className="bg-zinc-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-zinc-800 hover:shadow-lg transition-all disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
        >
          {isSyncing ? (
             <><span className="animate-spin inline-block">⏳</span> SYNCING...</>
          ) : (
             <><span className="inline-block">🔄</span> SYNC NOW</>
          )}
        </button>
      </div>

    </div>
  );
}
