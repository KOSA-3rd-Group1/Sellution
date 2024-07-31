import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 회사 정보를 전역 관리하는 공간
const useCompanyInfoStore = create(
  persist(
    (set, get) => ({
      companyId: null,
      displayName: '',
      name: '',
      logoImageUrl: null,
      promotionImageUrls: [],
      serviceType: '',
      subscriptionType: '',
      minDeliveryCount: 0,
      maxDeliveryCount: 0,
      themeColor: '',
      mainPromotion1Title: '',
      mainPromotion1Content: '',
      mainPromotion2Title: '',
      mainPromotion2Content: '',

      // 모든 데이터를 한 번에 설정하는 함수
      setAllCompanyData: (data) =>
        set({
          companyId: data.companyId,
          displayName: data.displayName,
          name: data.name,
          logoImageUrl: data.logoImageUrl,
          promotionImageUrls: data.promotionImageUrls,
          serviceType: data.serviceType,
          subscriptionType: data.subscriptionType,
          minDeliveryCount: data.minDeliveryCount,
          maxDeliveryCount: data.maxDeliveryCount,
          themeColor: data.themeColor,
          mainPromotion1Title: data.mainPromotion1Title,
          mainPromotion1Content: data.mainPromotion1Content,
          mainPromotion2Title: data.mainPromotion2Title,
          mainPromotion2Content: data.mainPromotion2Content,
        }),

      // 모든 데이터를 한 번에 가져오는 함수
      getAllCompanyData: () => {
        const state = get();
        return {
          companyId: state.companyId,
          displayName: state.displayName,
          name: state.name,
          logoImageUrl: state.logoImageUrl,
          promotionImageUrls: state.promotionImageUrls,
          serviceType: state.serviceType,
          subscriptionType: state.subscriptionType,
          minDeliveryCount: state.minDeliveryCount,
          maxDeliveryCount: state.maxDeliveryCount,
          themeColor: state.themeColor,
          mainPromotion1Title: state.mainPromotion1Title,
          mainPromotion1Content: state.mainPromotion1Content,
          mainPromotion2Title: state.mainPromotion2Title,
          mainPromotion2Content: state.mainPromotion2Content,
        };
      },

      clearCompanyData: () =>
        set({
          companyId: null,
          displayName: '',
          name: '',
          logoImageUrl: null,
          promotionImageUrls: [],
          serviceType: '',
          subscriptionType: '',
          minDeliveryCount: 0,
          maxDeliveryCount: 0,
          themeColor: '',
          mainPromotion1Title: '',
          mainPromotion1Content: '',
          mainPromotion2Title: '',
          mainPromotion2Content: '',
        }),
    }),
    {
      name: 'shop-company-storage',
      getStorage: () => localStorage,
    },
  ),
);

export default useCompanyInfoStore;
