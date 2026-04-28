import { create } from 'zustand';
import { apiClient } from '@/lib/apiClient';

export type ProductCategory = 'ALL' | 'OUTER' | 'TOP' | 'BOTTOM' | 'ACC';

export interface AdminProduct {
  id: number;
  brandName: string;
  productName: string;
  price: number;
  salePrice: number | null;
  productImageUrl: string;
  originUrl: string;
  mappedCategory: Exclude<ProductCategory, 'ALL'>;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK';
  hidden: boolean;
}

interface ProductState {
  products: AdminProduct[];
  filterCategory: ProductCategory;
  searchQuery: string;
  hideOutOfStock: boolean;
  loading: boolean;
  isSyncing: boolean;

  fetchProducts: () => Promise<void>;
  setFilterCategory: (val: ProductCategory) => void;
  setSearchQuery: (val: string) => void;
  setHideOutOfStock: (val: boolean) => void;
  syncNow: () => Promise<void>;
  toggleHidden: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filterCategory: 'ALL',
  searchQuery: '',
  hideOutOfStock: false,
  loading: false,
  isSyncing: false,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const { filterCategory } = get();
      const path = filterCategory === 'ALL'
        ? '/adm/v1/products'
        : `/adm/v1/products?category=${filterCategory}`;
      const res = await apiClient.get<AdminProduct[]>(path);
      set({ products: res.data });
    } finally {
      set({ loading: false });
    }
  },

  setFilterCategory: (val) => {
    set({ filterCategory: val });
    // 카테고리 바뀌면 바로 재조회
    setTimeout(() => get().fetchProducts(), 0);
  },

  setSearchQuery: (val) => set({ searchQuery: val }),

  setHideOutOfStock: (val) => set({ hideOutOfStock: val }),

  syncNow: async () => {
    if (get().isSyncing) return;
    set({ isSyncing: true });
    try {
      await apiClient.post('/adm/v1/products/sync', {});
      await get().fetchProducts();
    } finally {
      set({ isSyncing: false });
    }
  },

  toggleHidden: async (id) => {
    const product = get().products.find((p) => p.id === id);
    if (!product) return;
    const newHidden = !product.hidden;
    // 낙관적 업데이트
    set((state) => ({
      products: state.products.map((p) => p.id === id ? { ...p, hidden: newHidden } : p),
    }));
    try {
      await apiClient.patch(`/adm/v1/products/${id}/hidden`, { hidden: newHidden });
    } catch {
      // 실패 시 롤백
      set((state) => ({
        products: state.products.map((p) => p.id === id ? { ...p, hidden: !newHidden } : p),
      }));
    }
  },
}));
