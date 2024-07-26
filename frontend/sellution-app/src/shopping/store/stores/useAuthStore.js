import { create } from 'zustand';

const useAuthStore = create((set) => ({
  accessToken: null,
  setAccessToken: (token) => {
    set({ accessToken: token });
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  },
}));

export default useAuthStore;
