import { create } from 'zustand';

const useTableStore = create((set) => ({
  serviceType: null,
  sellType: null,
  subscriptionType: null,
  sellTypeCategory: {},
  sellTypeEach: {},
  subscriptionTypeMonth: {
    monthValues: [],
    weekValues: { 1: false, 2: false, 3: false, 4: false, 5: false },
    dayValues: { MON: false, TUE: false, WED: false, THU: false, FRI: false },
  },
  subscriptionTypeCount: {
    maxDeliveryCount: null,
    minDeliveryCount: null,
    weekValues: { 1: false, 2: false, 3: false, 4: false, 5: false },
    dayValues: { MON: false, TUE: false, WED: false, THU: false, FRI: false },
  },

  // 상태 업데이트 함수들
  setServiceType: (serviceType) => set({ serviceType }),
  setSellType: (sellType) => set({ sellType }),
  setSubscriptionType: (subscriptionType) => set({ subscriptionType }),
  setSellTypeCategory: (sellTypeCategory) => set({ sellTypeCategory }),
  setSellTypeEach: (sellTypeEach) => set({ sellTypeEach }),
  setSubscriptionTypeMonth: (subscriptionTypeMonth) => set({ subscriptionTypeMonth }),
  setSubscriptionTypeCount: (subscriptionTypeCount) => set({ subscriptionTypeCount }),
}));

export default useTableStore;
