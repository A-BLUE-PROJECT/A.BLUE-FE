import { create } from 'zustand';
import { apiClient } from '@/lib/apiClient';

export type StyleType = 'CASUAL' | 'FORMAL' | 'STREET' | 'SPORTY';
export type Season = 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER';
export type TargetGender = 'WOMEN' | 'MEN' | 'UNDEFINED';
export type Position = 'TOP' | 'BOTTOM' | 'SHOES' | 'OUTER' | 'ACC' | 'HEADWEAR' | 'BAG';

export interface GeneratorProduct {
  productId: number;
  name: string;
  price: number;
  thumbnailUrl: string;
  position: Position;
}

export interface ModelImage {
  imageUrl: string;
}

interface AdminProduct {
  id: number;
  brandName: string;
  productName: string;
  price: number;
  salePrice: number;
  productImageUrl: string;
  mappedCategory: string;
  stockStatus: string;
  hidden: boolean;
}

interface GeneratorState {
  // 기본 설정
  prompt: string;
  styleType: StyleType;
  season: Season;
  targetGender: TargetGender;
  ratio: '1:1' | '3:4' | '9:16';
  referenceImageUrl: string | null;

  // 상품
  products: GeneratorProduct[];
  isLoadingProducts: boolean;
  selectedProducts: GeneratorProduct[];

  // 모델
  models: ModelImage[];
  selectedModelUrl: string | null;
  isLoadingModels: boolean;

  // 생성 상태
  isGenerating: boolean;
  generatedLookbookId: number | null;
  generateError: string | null;

  // Actions
  setPrompt: (v: string) => void;
  setStyleType: (v: StyleType) => void;
  setSeason: (v: Season) => void;
  setTargetGender: (v: TargetGender) => void;
  setRatio: (v: '1:1' | '3:4' | '9:16') => void;
  setReferenceImageUrl: (v: string | null) => void;
  loadProducts: () => Promise<void>;
  toggleProduct: (p: GeneratorProduct) => void;
  setSelectedModelUrl: (url: string | null) => void;
  loadModels: (gender: TargetGender) => Promise<void>;
  generate: () => Promise<void>;
  resetResult: () => void;
}

export const useGeneratorStore = create<GeneratorState>((set, get) => ({
  prompt: '',
  styleType: 'CASUAL',
  season: 'SPRING',
  targetGender: 'WOMEN',
  ratio: '3:4',
  referenceImageUrl: null,
  products: [],
  isLoadingProducts: false,
  selectedProducts: [],
  models: [],
  selectedModelUrl: null,
  isLoadingModels: false,
  isGenerating: false,
  generatedLookbookId: null,
  generateError: null,

  setPrompt: (v) => set({ prompt: v }),
  setStyleType: (v) => set({ styleType: v }),
  setSeason: (v) => set({ season: v }),
  setTargetGender: (v) => {
    set({ targetGender: v, selectedModelUrl: null, models: [] });
    get().loadModels(v);
  },
  setRatio: (v) => set({ ratio: v }),
  setReferenceImageUrl: (v) => set({ referenceImageUrl: v }),

  loadProducts: async () => {
    set({ isLoadingProducts: true });
    try {
      const res = await apiClient.get<AdminProduct[]>('/adm/v1/products');
      const mapped: GeneratorProduct[] = res.data
        .filter((p) => !p.hidden && p.stockStatus !== 'OUT_OF_STOCK')
        .map((p) => ({
          productId: p.id,
          name: `${p.brandName} ${p.productName}`,
          price: p.salePrice,
          thumbnailUrl: p.productImageUrl,
          position: (p.mappedCategory as Position) ?? 'TOP',
        }));
      set({ products: mapped, isLoadingProducts: false });
    } catch {
      set({ products: [], isLoadingProducts: false });
    }
  },

  toggleProduct: (p) => set((state) => {
    const exists = state.selectedProducts.find(x => x.productId === p.productId);
    if (exists) {
      return { selectedProducts: state.selectedProducts.filter(x => x.productId !== p.productId) };
    }
    return { selectedProducts: [...state.selectedProducts, p] };
  }),

  setSelectedModelUrl: (url) => set({ selectedModelUrl: url }),

  loadModels: async (gender) => {
    const genderParam = gender === 'UNDEFINED' ? 'WOMEN' : gender;
    set({ isLoadingModels: true });
    try {
      const res = await apiClient.get<ModelImage[]>(`/adm/v1/models?gender=${genderParam}`);
      set({ models: res.data, isLoadingModels: false });
    } catch {
      set({ models: [], isLoadingModels: false });
    }
  },

  generate: async () => {
    const { prompt, styleType, season, targetGender, selectedProducts, selectedModelUrl } = get();
    set({ isGenerating: true, generatedLookbookId: null, generateError: null });

    try {
      const res = await apiClient.post<number>('/adm/v1/lookbooks/generate', {
        styleType,
        season,
        targetGender,
        prompt,
        modelImageUrl: selectedModelUrl,
        items: selectedProducts.map(p => ({
          productId: p.productId,
          position: p.position,
        })),
      });
      set({ isGenerating: false, generatedLookbookId: res.data });
    } catch (e) {
      const msg = e instanceof Error ? e.message : '생성 요청에 실패했습니다.';
      set({ isGenerating: false, generateError: msg });
    }
  },

  resetResult: () => set({ generatedLookbookId: null, isGenerating: false, generateError: null }),
}));
