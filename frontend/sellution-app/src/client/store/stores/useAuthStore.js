import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (token) => set({ accessToken: token }),
      removeAccessToken: () => set({ accessToken: null }),
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    },
  ),
);

export default useAuthStore;
