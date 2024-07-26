import { create } from 'zustand';

const useUserInfoStore = create((set) => ({
  name: null,
  setName: (newName) => {
    set({ name: newName });
    if (newName) {
      localStorage.setItem('name', newName);
    } else {
      localStorage.removeItem('name');
    }
  },
}));

export default useUserInfoStore;
