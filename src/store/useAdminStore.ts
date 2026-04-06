import { create } from 'zustand';
import { apiClient } from '@/lib/apiClient';
import type { LookbookResponse } from '@/types/lookbook';

export type LookbookStatus = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdminLookbook {
  id: number;
  title: string;
  imageUrl: string;
  aiScore: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

function mapLookbook(lb: LookbookResponse): AdminLookbook {
  return {
    id: lb.id,
    title: `${lb.styleType} · ${lb.season}`,
    imageUrl: lb.imageUrl,
    aiScore: lb.aiScore ?? 0,
    status: lb.status as AdminLookbook['status'],
    createdAt: lb.createdAt,
  };
}

interface AdminState {
  lookbooks: AdminLookbook[];
  filterStatus: LookbookStatus;
  minAiScore: number;
  selectedLookbookId: number | null;
  loading: boolean;

  fetchLookbooks: () => Promise<void>;
  setFilterStatus: (status: LookbookStatus) => void;
  setMinAiScore: (score: number) => void;
  setSelectedLookbookId: (id: number | null) => void;
  updateLookbookStatus: (id: number, action: 'approve' | 'reject') => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  lookbooks: [],
  filterStatus: 'PENDING',
  minAiScore: 0,
  selectedLookbookId: null,
  loading: false,

  fetchLookbooks: async () => {
    set({ loading: true });
    try {
      const { filterStatus } = get();
      const path = filterStatus === 'ALL'
        ? '/adm/v1/lookbooks'
        : `/adm/v1/lookbooks?status=${filterStatus}`;
      const res = await apiClient.get<LookbookResponse[] | { items: LookbookResponse[] }>(path);
      const raw = Array.isArray(res.data) ? res.data : res.data.items;
      set({ lookbooks: raw.map(mapLookbook) });
    } catch {
      set({ lookbooks: [] });
    } finally {
      set({ loading: false });
    }
  },

  setFilterStatus: (status) => {
    set({ filterStatus: status, selectedLookbookId: null });
    setTimeout(() => get().fetchLookbooks(), 0);
  },

  setMinAiScore: (score) => set({ minAiScore: score }),

  setSelectedLookbookId: (id) => set({ selectedLookbookId: id }),

  updateLookbookStatus: async (id, action) => {
    // 낙관적 업데이트
    const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';
    set((state) => ({
      lookbooks: state.lookbooks.map((lb) =>
        lb.id === id ? { ...lb, status: newStatus } : lb
      ),
      selectedLookbookId: null,
    }));
    try {
      await apiClient.patch(`/adm/v1/lookbooks/${id}/${action}`);
    } catch {
      // 실패 시 롤백
      const prev = action === 'approve' ? 'REJECTED' : 'APPROVED';
      set((state) => ({
        lookbooks: state.lookbooks.map((lb) =>
          lb.id === id ? { ...lb, status: prev as AdminLookbook['status'] } : lb
        ),
      }));
    }
  },
}));
