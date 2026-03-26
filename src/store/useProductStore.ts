import { create } from 'zustand';

export type ProductCategory = 'ALL' | 'OUTER' | 'TOP' | 'BOTTOM' | 'ACC';

export interface AdminProduct {
  id: string;
  name: string;
  category: Exclude<ProductCategory, 'ALL'>;
  price: number;
  stock: number;
  thumbnailUrl: string;
  status: 'SYNCED' | 'HIDDEN' | 'ERROR';
  lastSyncedAt: string;
}

const generateMockProducts = (): AdminProduct[] => {
  const data: AdminProduct[] = [];
  const baseTime = new Date('2026-03-01T10:00:00Z').getTime();

  for (let i = 1; i <= 30; i++) {
    const stock = i % 5 === 0 ? 0 : 50 + (i * 3) % 100; // 일부 품절(0) 처리
    const status = i % 7 === 0 ? 'HIDDEN' : (i % 13 === 0 ? 'ERROR' : 'SYNCED');
    const categories: Exclude<ProductCategory, 'ALL'>[] = ['OUTER', 'TOP', 'BOTTOM', 'ACC'];
    const category = categories[i % 4];
    
    data.push({
      id: `C24-P${i.toString().padStart(4, '0')}`,
      name: `A.BLUE Season Collection Piece #${i}`,
      category: category,
      price: 39000 + ((i * 10000) % 200000),
      stock: stock,
      thumbnailUrl: `https://picsum.photos/seed/prd${i}/200/200`,
      status: status,
      lastSyncedAt: new Date(baseTime - (i * 3600000)).toISOString(), // 1시간 간격 과거
    });
  }
  return data;
};

interface ProductState {
  products: AdminProduct[];
  hideOutOfStock: boolean;
  filterCategory: ProductCategory;
  searchQuery: string;
  isSyncing: boolean;

  setHideOutOfStock: (val: boolean) => void;
  setFilterCategory: (val: ProductCategory) => void;
  setSearchQuery: (val: string) => void;
  toggleProductStatus: (id: string) => void;
  syncNow: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: generateMockProducts(),
  hideOutOfStock: false,
  filterCategory: 'ALL',
  searchQuery: '',
  isSyncing: false,

  setHideOutOfStock: (val) => set({ hideOutOfStock: val }),
  setFilterCategory: (val) => set({ filterCategory: val }),
  setSearchQuery: (val) => set({ searchQuery: val }),
  
  toggleProductStatus: (id) => set((state) => ({
    products: state.products.map(p => {
      if (p.id === id) {
        // Toggle SYNCED <-> HIDDEN
        const newStatus = p.status === 'HIDDEN' ? 'SYNCED' : 'HIDDEN';
        return { ...p, status: newStatus };
      }
      return p;
    })
  })),

  syncNow: () => {
    set({ isSyncing: true });
    setTimeout(() => {
      // Refresh lastSyncedAt to current Mock Date
      const fakeNow = new Date('2026-03-26T12:00:00Z').toISOString();
      set((state) => ({
        isSyncing: false,
        products: state.products.map(p => ({ ...p, lastSyncedAt: fakeNow, status: p.status === 'ERROR' ? 'SYNCED' : p.status }))
      }));
    }, 2000);
  }
}));
