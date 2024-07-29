import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserInfoStore = create(
  persist(
    (set) => ({
      name: null,
      conmapyId: null,
      contractCompanyName: null,
      id: null,
      userRole: null,
      setUserInfo: (userInfo) => set(userInfo),
    }),
    {
      name: 'userInfo', // 로컬 스토리지에 저장될 키 이름
      getStorage: () => localStorage, // 로컬 스토리지를 사용
    },
  ),
);

export default useUserInfoStore;
