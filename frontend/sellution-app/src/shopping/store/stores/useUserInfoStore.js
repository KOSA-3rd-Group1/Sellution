import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserInfoStore = create(
  persist(
    (set) => ({
      id: null,
      companyId: null,
      name: '',
      customerType: '',

      // 모든 사용자 데이터를 한 번에 설정하는 함수
      setAllUserData: (data) =>
        set({
          id: data.id,
          companyId: data.companyId,
          name: data.name,
          customerType: data.customerType,
        }),

      // 개별 필드 setter 함수들
      setId: (id) => set({ id }),
      setCompanyId: (companyId) => set({ companyId }),
      setName: (name) => set({ name }),
      setCustomerType: (customerType) => set({ customerType }),

      // 사용자 데이터를 초기화하는 함수
      clearUserData: () =>
        set({
          id: null,
          companyId: null,
          name: '',
          customerType: '',
        }),
    }),
    {
      name: 'shop-user-storage', // localStorage에 저장될 키 이름
      getStorage: () => localStorage, // 사용할 스토리지 지정
    },
  ),
);

export default useUserInfoStore;
