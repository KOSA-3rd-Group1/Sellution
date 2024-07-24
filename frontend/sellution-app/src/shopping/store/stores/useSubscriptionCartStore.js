import { create } from 'zustand';

const useSubscriptionCartStore = create((set) => ({
  subscriptionCart: [],
  selectedSubscriptionItems: [],

  updateSubscriptionCart: (newItem) =>
    set((state) => {
      const updatedItems = [...state.subscriptionCart];
      const itemIndex = updatedItems.findIndex((item) => item.productId === newItem.productId);
      if (itemIndex > -1) {
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: updatedItems[itemIndex].quantity + newItem.quantity,
        };
      } else {
        updatedItems.push(newItem);
      }
      return { subscriptionCart: updatedItems };
    }),

  removeFromSubscriptionCart: (itemId) =>
    set((state) => ({
      subscriptionCart: state.subscriptionCart.filter((item) => item.productId !== itemId),
      selectedSubscriptionItems: state.selectedSubscriptionItems.filter((id) => id !== itemId),
    })),

  resetSubscriptionCart: () =>
    set({
      subscriptionCart: [],
      selectedSubscriptionItems: [],
    }),

  increaseSubscriptionCartQuantity: (itemId) =>
    set((state) => ({
      subscriptionCart: state.subscriptionCart.map((item) =>
        item.productId === itemId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    })),

  decreaseSubscriptionCartQuantity: (itemId) =>
    set((state) => ({
      subscriptionCart: state.subscriptionCart.map((item) =>
        item.productId === itemId ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item,
      ),
    })),

  toggleSelectedSubscriptionItems: (itemId) =>
    set((state) => ({
      selectedSubscriptionItems: state.selectedSubscriptionItems.includes(itemId)
        ? state.selectedSubscriptionItems.filter((id) => id !== itemId)
        : [...state.selectedSubscriptionItems, itemId],
    })),

  selectAllSubscriptionItems: (select) =>
    set((state) => ({
      selectedSubscriptionItems: select ? state.subscriptionCart.map((item) => item.productId) : [],
    })),

  removeSelectedSubscriptionItems: () =>
    set((state) => ({
      subscriptionCart: state.subscriptionCart.filter(
        (item) => !state.selectedSubscriptionItems.includes(item.productId),
      ),
      selectedSubscriptionItems: [],
    })),
}));

export default useSubscriptionCartStore;
