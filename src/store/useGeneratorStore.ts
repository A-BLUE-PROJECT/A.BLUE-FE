import { create } from 'zustand';

export interface DummyProduct {
  productId: string;
  name: string;
  price: number;
  thumbnailUrl: string;
}

export const MOCK_CAFE24_PRODUCTS: DummyProduct[] = [
  { productId: 'p1', name: 'A.BLUE Signature Denim', price: 89000, thumbnailUrl: 'https://picsum.photos/seed/p1/200/200' },
  { productId: 'p2', name: 'Oversized Wool Blazer', price: 154000, thumbnailUrl: 'https://picsum.photos/seed/p2/200/200' },
  { productId: 'p3', name: 'Basic Logo T-Shirt', price: 39000, thumbnailUrl: 'https://picsum.photos/seed/p3/200/200' },
  { productId: 'p4', name: 'Leather Crossbody Bag', price: 112000, thumbnailUrl: 'https://picsum.photos/seed/p4/200/200' },
];

interface GeneratorState {
  prompt: string;
  ratio: '1:1' | '3:4' | '9:16';
  referenceImageUrl: string | null;
  selectedProducts: DummyProduct[];
  isGenerating: boolean;
  generatedResultUrl: string | null;

  setPrompt: (v: string) => void;
  setRatio: (v: '1:1' | '3:4' | '9:16') => void;
  setReferenceImageUrl: (v: string | null) => void;
  toggleProduct: (p: DummyProduct) => void;
  generate: () => void;
  resetResult: () => void;
}

export const useGeneratorStore = create<GeneratorState>((set) => ({
  prompt: '',
  ratio: '3:4',
  referenceImageUrl: null,
  selectedProducts: [],
  isGenerating: false,
  generatedResultUrl: null,

  setPrompt: (v) => set({ prompt: v }),
  setRatio: (v) => set({ ratio: v }),
  setReferenceImageUrl: (v) => set({ referenceImageUrl: v }),
  
  toggleProduct: (p) => set((state) => {
    const exists = state.selectedProducts.find(x => x.productId === p.productId);
    if (exists) {
      return { selectedProducts: state.selectedProducts.filter(x => x.productId !== p.productId) };
    }
    return { selectedProducts: [...state.selectedProducts, p] };
  }),

  generate: () => {
    set({ isGenerating: true, generatedResultUrl: null });
    
    // Simulate API delay (4 seconds for AI gen)
    setTimeout(() => {
      // Deterministic random for mock presentation avoiding hydration issues
      // Since generate is a client-side action, using Date.now() here won't cause SSR mismatch
      set({ 
        isGenerating: false, 
        generatedResultUrl: `https://picsum.photos/seed/gen${Date.now()}/600/800`
      });
    }, 4000);
  },

  resetResult: () => set({ generatedResultUrl: null, isGenerating: false })
}));
