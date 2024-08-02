import { create } from 'zustand';

// 초기 상태를 정의
const initialState = {
  companyId: null,
  businessRegistrationNumber: null,
  contractCompanyName: null,
  name: null,
  phoneNumber: null,
};

const useSignupInfoStore = create((set) => ({
  ...initialState, // 초기 상태 설정
  setSignupInfo: (newSignupInfo) =>
    set((state) => ({
      ...state,
      ...newSignupInfo,
    })),
  resetSignupInfo: () => set({ ...initialState }), // 초기 상태로 리셋
}));
export default useSignupInfoStore;
