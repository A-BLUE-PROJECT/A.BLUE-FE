'use client';

import { useProductStore } from '@/store/useProductStore';
import { clsx } from 'clsx';
import { useEffect, useMemo } from 'react';
import type { ProductCategory } from '@/store/useProductStore';

export function ProductTable() {
  const products = useProductStore((state) => state.products);
  const filterCategory = useProductStore((state) => state.filterCategory);
  const setFilterCategory = useProductStore((state) => state.setFilterCategory);
  const searchQuery = useProductStore((state) => state.searchQuery);
  const toggleHidden = useProductStore((state) => state.toggleHidden);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const loading = useProductStore((state) => state.loading);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) => p.productName.toLowerCase().includes(q) || p.brandName.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#F5F5F5]">
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">

        {/* Category Tabs */}
        <div className="flex items-center gap-8 px-6 pt-5 pb-0 border-b border-zinc-100">
          {(['ALL', 'OUTER', 'TOP', 'BOTTOM', 'ACC'] as ProductCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={clsx(
                'text-sm font-bold pb-4 transition-all relative',
                filterCategory === cat ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
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
        <div className="grid grid-cols-[80px_1fr_120px_120px_100px_100px] gap-4 px-6 py-4 bg-zinc-50 border-b border-zinc-100 text-xs font-bold text-zinc-500 uppercase tracking-wider">
          <div className="text-center">Image</div>
          <div>Product Info</div>
          <div className="text-right">Price</div>
          <div className="text-right">Sale Price</div>
          <div className="text-center">Stock</div>
          <div className="text-center">Manage</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-zinc-100">
          {loading ? (
            <div className="h-64 flex items-center justify-center text-zinc-400">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-zinc-400 bg-white">
              <span className="text-3xl mb-2">📭</span>
              <p>No products found.</p>
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className={clsx(
                  'grid grid-cols-[80px_1fr_120px_120px_100px_100px] gap-4 px-6 py-3 items-center transition-colors hover:bg-zinc-50',
                  p.hidden && 'opacity-50 bg-zinc-50/50'
                )}
              >
                {/* Image */}
                <div className="flex justify-center">
                  <div className="w-12 h-16 bg-zinc-200 rounded-md overflow-hidden relative ring-1 ring-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.productImageUrl} alt={p.productName} className="object-cover w-full h-full" />
                    {p.stockStatus === 'OUT_OF_STOCK' && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">SOLD OUT</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="min-w-0 flex flex-col items-start justify-center gap-1">
                  <span className="bg-zinc-100 text-zinc-500 text-[10px] font-bold px-1.5 py-0.5 rounded-sm tracking-wide">
                    {p.mappedCategory}
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 truncate">{p.productName}</h3>
                  <p className="text-[11px] text-zinc-400">{p.brandName}</p>
                </div>

                {/* Price */}
                <div className="text-right text-sm font-medium text-zinc-600">
                  ₩ {p.price.toLocaleString()}
                </div>

                {/* Sale Price */}
                <div className="text-right text-sm font-medium text-blue-500">
                  {p.salePrice ? `₩ ${p.salePrice.toLocaleString()}` : '-'}
                </div>

                {/* Stock */}
                <div className="flex justify-center">
                  <span className={clsx(
                    'px-2 py-1 rounded text-[10px] font-bold tracking-wider',
                    p.stockStatus === 'IN_STOCK' ? 'bg-lime-100 text-lime-700' : 'bg-rose-100 text-rose-700'
                  )}>
                    {p.stockStatus === 'IN_STOCK' ? 'IN STOCK' : 'SOLD OUT'}
                  </span>
                </div>

                {/* Manage */}
                <div className="flex justify-center">
                  <button
                    onClick={() => toggleHidden(p.id)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-md transition-colors border shadow-sm bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700"
                  >
                    {p.hidden ? 'SHOW' : 'HIDE'}
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
