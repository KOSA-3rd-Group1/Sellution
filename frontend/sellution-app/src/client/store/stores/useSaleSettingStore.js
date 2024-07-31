import { create } from 'zustand';

const useSaleSettingStore = create((set) => ({
  saleTypes: {
    serviceType: null,
    sellType: null,
    subscriptionType: null,
  },
  sellTypeCategory: {
    selectOptions: [],
    selectedOptions: [],
  },
  sellTypeEach: {
    selectBothOptions: [],
    selectOnetimeOptions: [],
    selectSubscriptionOptions: [],
    selectedOptions: [],
  },
  subscriptionTypeMonth: {
    selectedMonthOptions: [],
    weekValues: { 1: false, 2: false, 3: false, 4: false, 5: false },
    dayValues: { MON: false, TUE: false, WED: false, THU: false, FRI: false },
  },
  subscriptionTypeCount: {
    maxDeliveryCount: 30,
    minDeliveryCount: 5,
    weekValues: { 1: false, 2: false, 3: false, 4: false, 5: false },
    dayValues: { MON: false, TUE: false, WED: false, THU: false, FRI: false },
  },

  // 상태 업데이트 함수들
  setSaleTypes: (newSaleTypes) =>
    set((state) => ({
      saleTypes: {
        ...state.saleTypes,
        ...newSaleTypes,
      },
    })),
  setSellTypeCategory: (newSellTypeCategory) =>
    set((state) => ({
      sellTypeCategory: {
        ...state.sellTypeCategory,
        ...newSellTypeCategory,
      },
    })),
  setSellTypeEach: (newSellTypeEach) =>
    set((state) => ({
      sellTypeEach: {
        ...state.sellTypeEach,
        ...newSellTypeEach,
      },
    })),
  setSubscriptionTypeMonth: (newSubscriptionTypeMonth) =>
    set((state) => ({
      subscriptionTypeMonth: {
        ...state.subscriptionTypeMonth,
        ...newSubscriptionTypeMonth,
      },
    })),
  setSubscriptionTypeCount: (newSubscriptionTypeCount) =>
    set((state) => ({
      subscriptionTypeCount: {
        ...state.subscriptionTypeCount,
        ...newSubscriptionTypeCount,
      },
    })),
}));

export default useSaleSettingStore;
