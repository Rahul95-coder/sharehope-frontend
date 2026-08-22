import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
    setInitializing: (value) => set({ isInitializing: value }),
}));