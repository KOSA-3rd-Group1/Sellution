import { create } from 'zustand';

const useOrderListStore = create((set) => ({
  orderList: [],

  updateOrderList: (selectedItemsIndexList, cart) => {
    // selectedItemsIndexList에는 체크한 product의 productId들만 있음
    const selectedProducts = cart.filter((item) => selectedItemsIndexList.includes(item.productId));
    set((state) => ({
      ...state,
      orderList: selectedProducts,
    }));
  },

  resetOrderList: () => {
    set((state) => ({
      ...state,
      orderList: [],
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
