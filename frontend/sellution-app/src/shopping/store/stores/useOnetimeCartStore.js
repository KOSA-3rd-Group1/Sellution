import { create } from 'zustand';

const useOnetimeCartStore = create((set) => ({
  onetimeCart: [],
  selectedOnetimeItems: [],

  updateOnetimeCart: (newItem) =>
    set((state) => {
      const updatedItems = [...state.onetimeCart];
      const itemIndex = updatedItems.findIndex((item) => item.productId === newItem.productId);
      if (itemIndex > -1) {
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: updatedItems[itemIndex].quantity + newItem.quantity,
        };
      } else {
        updatedItems.push(newItem);
      }
      return { onetimeCart: updatedItems };
    }),

  removeFromOnetimeCart: (itemId) =>
    set((state) => ({
      onetimeCart: state.onetimeCart.filter((item) => item.productId !== itemId),
      selectedOnetimeItems: state.selectedOnetimeItems.filter((id) => id !== itemId),
    })),

  resetOnetimeCart: () =>
    set({
      onetimeCart: [],
      selectedOnetimeItems: [],
    }),

  increaseOnetimeCartQuantity: (itemId) =>
    set((state) => ({
      onetimeCart: state.onetimeCart.map((item) =>
        item.productId === itemId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    })),

  decreaseOnetimeCartQuantity: (itemId) =>
    set((state) => ({
      onetimeCart: state.onetimeCart.map((item) =>
        item.productId === itemId ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item,
      ),
    })),

  toggleSelectedOnetimeItems: (itemId) =>
    set((state) => ({
      selectedOnetimeItems: state.selectedOnetimeItems.includes(itemId)
        ? state.selectedOnetimeItems.filter((id) => id !== itemId)
        : [...state.selectedOnetimeItems, itemId],
    })),

  selectAllOnetimeItems: (select) =>
    set((state) => ({
      selectedOnetimeItems: select ? state.onetimeCart.map((item) => item.productId) : [],
    })),
  removeSelectedOnetimeItems: () =>
    set((state) => ({
      onetimeCart: state.onetimeCart.filter(
        (item) => !state.selectedOnetimeItems.includes(item.productId),
      ),
      selectedOnetimeItems: [],
    })),
}));

export default useOnetimeCartStore;
//상태를 업데이트할 때 불변성을 유지하기 위해 항상 새로운 배열이나 객체를 반환
//이렇게 하면, react가 상태 변경을 올바르게 감지하고 컴포넌트를 리렌더링할 수 있다
