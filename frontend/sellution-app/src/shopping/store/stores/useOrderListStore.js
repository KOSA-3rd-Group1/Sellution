import { create } from 'zustand';

const useOrderListStore = create((set) => ({
  orderList: [],

  updateOrderList: (selectedItemsIndexList, cart) => {
    //selectedItems에는 체크한 product의 id들만 있음
    const selectedProducts = cart.filter((item) => selectedItemsIndexList.includes(item.id));
    set((state) => ({
      ...state,
      orderList: selectedProducts,
    }));
  },

  resetOrderList: () => {
    set((state) => ({
      ...state,
      orderLsit: [],
    }));
  },

  updateOrderListForDirectOrder: (product) => {
    set((state) => ({
      ...state,
      orderList: [product],
    }));
  },
}));

export default useOrderListStore;
