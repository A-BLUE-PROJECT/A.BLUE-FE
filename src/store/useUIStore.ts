import { create } from "zustand";

export interface LookbookLight {
  id: number;
  src: string;
  score: number;
  tags: string[];
}

interface UIState {
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  isQuickViewOpen: boolean;
  quickViewLookbooks: LookbookLight[];
  quickViewIndex: number;
  quickViewDirection: number;
  openQuickView: (lookbooks: LookbookLight[], startIndex: number) => void;
  closeQuickView: () => void;
  nextQuickView: () => void;
  prevQuickView: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoginModalOpen: false,
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  isMenuOpen: false,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  closeMenu: () => set({ isMenuOpen: false }),
  isQuickViewOpen: false,
  quickViewLookbooks: [],
  quickViewIndex: 0,
  quickViewDirection: 0,
  openQuickView: (lookbooks, startIndex) => set({ 
    isQuickViewOpen: true, 
    quickViewLookbooks: lookbooks, 
    quickViewIndex: startIndex,
    quickViewDirection: 0
  }),
  closeQuickView: () => set({ isQuickViewOpen: false, quickViewLookbooks: [] }),
  nextQuickView: () => set((state) => ({
    quickViewIndex: Math.min(state.quickViewIndex + 1, state.quickViewLookbooks.length - 1),
    quickViewDirection: 1
  })),
  prevQuickView: () => set((state) => ({
    quickViewIndex: Math.max(state.quickViewIndex - 1, 0),
    quickViewDirection: -1
  })),
}));
