import { create } from 'zustand';

// 데이터 모델
export type LookbookStatus = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Product {
  productId: string;
  name: string;
  price: number;
  thumbnailUrl: string;
  detailUrl: string;
}

export interface Lookbook {
  id: string;
  title: string;
  imageUrl: string;
  aiScore: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  relatedProducts: Product[];
}

interface AdminState {
  lookbooks: Lookbook[];
  filterStatus: LookbookStatus;
  minAiScore: number;
  selectedLookbookId: string | null;

  // Actions
  setFilterStatus: (status: LookbookStatus) => void;
  setMinAiScore: (score: number) => void;
  setSelectedLookbookId: (id: string | null) => void;
  updateLookbookStatus: (id: string, newStatus: 'APPROVED' | 'REJECTED') => void;
  getFilteredLookbooks: () => Lookbook[];
}

// 50개의 더미 데이터 생성기 (Hydration Error 방지를 위해 Deterministic 값 사용)
const generateMockLookbooks = (): Lookbook[] => {
  const data: Lookbook[] = [];

  for (let i = 1; i <= 50; i++) {
    const isPending = i <= 30; // 30개는 펜딩
    const status = isPending ? 'PENDING' : (i % 2 === 0 ? 'APPROVED' : 'REJECTED');
    
    // 고정된 과거 날짜 생성 (2026-03-01 기준 하루씩 빼기)
    const baseTime = new Date('2026-03-01T12:00:00Z').getTime();
    
    data.push({
      id: `lb-${i.toString().padStart(4, '0')}`,
      title: `AI Curation Look #${i}`,
      imageUrl: `https://picsum.photos/seed/lookbook${i}/600/800`, // 고정된 시드
      aiScore: 50 + ((i * 7) % 50), // 50~99 사이의 결정론적 값
      status: status,
      createdAt: new Date(baseTime - (i * 86400000)).toISOString(),
      relatedProducts: [
        {
          productId: `prod-${i}-1`,
          name: 'A.BLUE Signature Jacket',
          price: 129000,
          thumbnailUrl: `https://picsum.photos/seed/prod${i}A/200/200`,
          detailUrl: '#'
        },
        {
          productId: `prod-${i}-2`,
          name: 'Classic Wide Denim',
          price: 89000,
          thumbnailUrl: `https://picsum.photos/seed/prod${i}B/200/200`,
          detailUrl: '#'
        }
      ]
    });
  }
  return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const useAdminStore = create<AdminState>((set, get) => ({
  lookbooks: generateMockLookbooks(),
  filterStatus: 'PENDING',
  minAiScore: 0,
  selectedLookbookId: null,

  setFilterStatus: (status) => set({ filterStatus: status }),
  setMinAiScore: (score) => set({ minAiScore: score }),
  setSelectedLookbookId: (id) => set({ selectedLookbookId: id }),

  updateLookbookStatus: (id, newStatus) =>
    set((state) => ({
      lookbooks: state.lookbooks.map((lb) =>
        lb.id === id ? { ...lb, status: newStatus } : lb
      ),
      // 승인/반려 시 모달 닫기
      selectedLookbookId: null,
    })),

  getFilteredLookbooks: () => {
    const { lookbooks, filterStatus, minAiScore } = get();
    return lookbooks.filter((lb) => {
      const matchStatus = filterStatus === 'ALL' || lb.status === filterStatus;
      const matchScore = lb.aiScore >= minAiScore;
      return matchStatus && matchScore;
    });
  },
}));
