import { create } from "zustand";
import { apiClient } from "@/lib/apiClient";

interface User {
  id: number;
  email: string;
  status: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  fetchMe: () => Promise<User | null>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

  fetchMe: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient.get<User>("/w/v1/users/me");
      set({ user: res.data, isLoading: false });
      return res.data;
    } catch {
      set({ user: null, isLoading: false });
      return null;
    }
  },

  logout: async () => {
    try {
      await apiClient.post("/w/v1/auth/logout", {});
    } catch {
      // ignore
    }
    set({ user: null });
  },
}));
