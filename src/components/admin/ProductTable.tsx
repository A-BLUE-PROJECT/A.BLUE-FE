'use client';

import { useProductStore } from '@/store/useProductStore';
import { clsx } from 'clsx';
import { useMemo } from 'react';

export function ProductTable() {
  const products = useProductStore((state) => state.products);
  const hideOutOfStock = useProductStore((state) => state.hideOutOfStock);
  const filterCategory = useProductStore((state) => state.filterCategory);
  const setFilterCategory = useProductStore((state) => state.setFilterCategory);
  const searchQuery = useProductStore((state) => state.searchQuery);
  const toggleProductStatus = useProductStore((state) => state.toggleProductStatus);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStock = hideOutOfStock ? p.stock > 0 : true;
      const matchCat = filterCategory === 'ALL' || p.category === filterCategory;
      return matchSearch && matchStock && matchCat;
    });
  }, [products, hideOutOfStock, searchQuery, filterCategory]);

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#F5F5F5]">
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-8 px-6 pt-5 pb-0 border-b border-zinc-100">
          {(['ALL', 'OUTER', 'TOP', 'BOTTOM', 'ACC'] as const).map(cat => (
             <button
               key={cat}
               onClick={() => setFilterCategory(cat)}
               className={clsx(
                 "text-sm font-bold pb-4 transition-all relative",
                 filterCategory === cat ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
               )}
             >
               {cat}
               {filterCategory === cat && (
                 <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 rounded-t-sm" />
               )}
             </button>
          ))}
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[80px_1fr_120px_100px_150px_120px_100px] gap-4 px-6 py-4 bg-zinc-50 border-b border-zinc-100 text-xs font-bold text-zinc-500 uppercase tracking-wider">
          <div className="text-center">Image</div>
          <div>Product Info</div>
          <div className="text-right">Price</div>
          <div className="text-right">Stock</div>
          <div className="text-center">Last Synced</div>
          <div className="text-center">Status</div>
          <div className="text-center">Manage</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-zinc-100">
          {filteredProducts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-zinc-400 bg-white">
               <span className="text-3xl mb-2">📭</span>
               <p>No products found matching your filters.</p>
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div key={p.id} className={clsx(
                "grid grid-cols-[80px_1fr_120px_100px_150px_120px_100px] gap-4 px-6 py-3 items-center transition-colors hover:bg-zinc-50",
                p.status === 'HIDDEN' && "opacity-50 bg-zinc-50/50"
              )}>
                {/* Image */}
                <div className="flex justify-center">
                  <div className="w-12 h-16 bg-zinc-200 rounded-md overflow-hidden relative ring-1 ring-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.thumbnailUrl} alt={p.name} className="object-cover w-full h-full" />
                    {p.stock === 0 && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                         <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">SOLD OUT</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="min-w-0 flex flex-col items-start justify-center gap-1">
                  <span className="bg-zinc-100 text-zinc-500 text-[10px] font-bold px-1.5 py-0.5 rounded-sm tracking-wide">{p.category}</span>
                  <div className="w-full">
                    <h3 className="text-sm font-bold text-zinc-900 truncate">{p.name}</h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">{p.id}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right text-sm font-medium text-zinc-600">
                  ₩ {p.price.toLocaleString()}
                </div>

                {/* Stock */}
                <div className="text-right">
                  <span className={clsx(
                    "text-sm font-bold",
                    p.stock === 0 ? "text-rose-500" : p.stock < 10 ? "text-amber-500" : "text-lime-600"
                  )}>
                    {p.stock} <span className="text-xs font-normal text-zinc-400">ea</span>
                  </span>
                </div>

                {/* Synced */}
                <div className="text-center text-xs text-zinc-400">
                  {new Date(p.lastSyncedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>

                {/* Status Badge */}
                <div className="flex justify-center">
                  <span className={clsx(
                    "px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider relative",
                    p.status === 'SYNCED' ? "bg-lime-100 text-lime-700" :
                    p.status === 'HIDDEN' ? "bg-zinc-200 text-zinc-600" :
                    "bg-rose-100 text-rose-700"
                  )}>
                    {p.status}
                    {p.status === 'ERROR' && (
                       <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                       </span>
                    )}
                  </span>
                </div>

                {/* Manage (Override Toggle) */}
                <div className="flex justify-center">
                   <button
                     onClick={() => toggleProductStatus(p.id)}
                     className="text-xs font-semibold px-3 py-1.5 rounded-md transition-colors border shadow-sm bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700"
                   >
                     {p.status === 'HIDDEN' ? 'SHOW' : 'HIDE'}
                   </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
