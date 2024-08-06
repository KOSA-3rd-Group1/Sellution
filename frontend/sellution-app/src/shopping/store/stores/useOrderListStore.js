import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useOrderListStore = create(
  persist(
    (set) => ({
      orderList: [],

      updateOrderList: (selectedItemsIndexList, cart) => {
        const selectedProducts = cart.filter((item) =>
          selectedItemsIndexList.includes(item.productId),
        );
        set({ orderList: selectedProducts });
      },

      resetOrderList: () => set({ orderList: [] }),

      updateOrderListForDirectOrder: (product) => set({ orderList: [product] }),
    }),
    {
      name: 'order-list-storage',
      getStorage: () => localStorage,
    },
  ),
);

export default useOrderListStore;
