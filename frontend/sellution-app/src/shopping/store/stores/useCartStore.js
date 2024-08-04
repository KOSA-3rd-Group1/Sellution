import { create } from 'zustand';

import {
  findCart,
  addToCart,
  removeFromCart,
  clearCart,
  increaseCartItem,
  decreaseCartItem,
} from '@/shopping/utility/apis/cartApi';

const useCartStore = create((set, get) => ({
  onetimeCart: [],
  subscriptionCart: [],
  selectedOnetimeItems: [],
  selectedSubscriptionItems: [],

  findCart: async (cartType, accessToken, setAccessToken) => {
    const response = await findCart(cartType, accessToken, setAccessToken);
    const fetchedData = response.data;
    console.log('findCart >>>>> ', response);
    if (cartType === 'ONETIME') {
      set({ onetimeCart: fetchedData });
    } else if (cartType === 'SUBSCRIPTION') {
      set({ subscriptionCart: fetchedData });
    }
  },

  // findCartFromRedis: async (cartType, accessToken, setAccessToken) => {
  //   const response = await findCartFromRedis(cartType, accessToken, setAccessToken);
  //   const fetchedData = response.data;
  //   console.log('findCartFromRedis >> ', fetchedData);
  //   if (cartType === 'ONETIME') {
  //     // Redis에서 가져온 데이터를 필요한 형태로 변환
  //     const updatedCart = Object.entries(fetchedData).map(([productId, quantity]) => ({
  //       productId: Number(productId),
  //       quantity,
  //     }));
  //     set({ onetimeCart: updatedCart });
  //     console.log('장바구니:', get().onetimeCart, fetchedData);
  //   } else if (cartType === 'SUBSCRIPTION') {
  //     // Redis에서 가져온 데이터를 필요한 형태로 변환
  //     const updatedCart = Object.entries(fetchedData).map(([productId, quantity]) => ({
  //       productId: Number(productId),
  //       quantity,
  //     }));
  //     set({ subscriptionCart: updatedCart });
  //     console.log('장바구니', get().subscriptionCart, fetchedData);
  //   }
  // },

  addToCart: async (cartType, productId, quantity, accessToken, setAccessToken) => {
    await addToCart(cartType, productId, quantity, accessToken, setAccessToken); //장바구니에 상품 추가
    //get().findCart(cartType, accessToken, setAccessToken);
    set((state) => {
      const cartKey = cartType === 'ONETIME' ? 'onetimeCart' : 'subscriptionCart';
      const updatedCart = state[cartKey].map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
      );
      if (!updatedCart.find((item) => item.productId === productId)) {
        updatedCart.push({ productId, quantity });
      }
      return { [cartKey]: updatedCart };
    });
  },

  removeFromCart: async (cartType, productId, accessToken, setAccessToken) => {
    await removeFromCart(cartType, productId, accessToken, setAccessToken);
    //get.findCart(cartType, accessToken, setAccessToken);
    set((state) => {
      const cartKey = cartType === 'ONETIME' ? 'onetimeCart' : 'subscriptionCart';
      return {
        [cartKey]: state[cartKey].filter((item) => item.productId !== productId),
      };
    });
  },

  //여러개 한번에 삭제
  removeItemsFromCart: async (cartType, productIds, accessToken, setAccessToken) => {
    for (let productId of productIds) {
      await removeFromCart(cartType, productId, accessToken, setAccessToken);
    }
    set((state) => {
      const cartKey = cartType === 'ONETIME' ? 'onetimeCart' : 'subscriptionCart';
      return {
        [cartKey]: state[cartKey].filter((item) => !productIds.includes(item.productId)),
      };
    });
  },

  clearCart: async (cartType, accessToken, setAccessToken) => {
    await clearCart(cartType, accessToken, setAccessToken);
    //get().findCart(cartType, accessToken, setAccessToken);
    set((state) => {
      const cartKey = cartType === 'ONETIME' ? 'onetimeCart' : 'subscriptionCart';
      return { [cartKey]: [] };
    });
  },

  increaseCartItem: async (cartType, productId, accessToken, setAccessToken) => {
    await increaseCartItem(cartType, productId, accessToken, setAccessToken);
    //get().findCart(cartType, accessToken, setAccessToken);
    set((state) => {
      const cartKey = cartType === 'ONETIME' ? 'onetimeCart' : 'subscriptionCart';
      return {
        [cartKey]: state[cartKey].map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      };
    });
  },

  decreaseCartItem: async (cartType, productId, accessToken, setAccessToken) => {
    await decreaseCartItem(cartType, productId, accessToken, setAccessToken);
    //get().findCart(cartType, accessToken, setAccessToken);
    set((state) => {
      const cartKey = cartType === 'ONETIME' ? 'onetimeCart' : 'subscriptionCart';
      return {
        [cartKey]: state[cartKey].map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
            : item,
        ),
      };
    });
  },

  //selectedItems 생성, 수정 ( 특정 상품의 선택 상태를 선택/해제 )
  toggleSelectedItems: (cartType, productId) => {
    set((state) => {
      const cartKey = cartType === 'ONETIME' ? 'onetimeCart' : 'subscriptionCart';
      const selectedItemsKey =
        cartType === 'ONETIME' ? 'selectedOnetimeItems' : 'selectedSubscriptionItems';
      const selectedItems = state[selectedItemsKey];
      const item = state[cartKey].find((item) => item.productId === productId);

      // Only toggle if the item is visible
      if (item && item.isVisible !== 'N') {
        const isSelected = selectedItems.includes(productId);
        return {
          [selectedItemsKey]: isSelected
            ? selectedItems.filter((id) => id !== productId)
            : [...selectedItems, productId],
        };
      }
      return {};
    });
  },

  selectAllItems: (cartType, select) => {
    set((state) => {
      const cartKey = cartType === 'ONETIME' ? 'onetimeCart' : 'subscriptionCart';
      const selectedItemsKey =
        cartType === 'ONETIME' ? 'selectedOnetimeItems' : 'selectedSubscriptionItems';

      // Filter out items that are not visible
      const visibleItems = state[cartKey].filter((item) => item.isVisible !== 'N');

      return {
        [selectedItemsKey]: select ? visibleItems.map((item) => item.productId) : [],
      };
    });
  },

  removeSelectedItems: async (cartType, accessToken, setAccessToken) => {
    const selectedItemsKey =
      cartType === 'ONETIME' ? 'selectedOnetimeItems' : 'selectedSubscriptionItems';
    const selectedItems = get()[selectedItemsKey];
    for (let productId of selectedItems) {
      await get().removeFromCart(cartType, productId, accessToken, setAccessToken);
    }
    set((state) => {
      const cartKey = cartType === 'ONETIME' ? 'onetimeCart' : 'subscriptionCart';
      return {
        [cartKey]: state[cartKey].filter((item) => !selectedItems.includes(item.productId)),
        [selectedItemsKey]: [],
      };
    });
  },

  // New method to get visible items count
  getVisibleItemsCount: (cartType) => {
    const state = get();
    const cartKey = cartType === 'ONETIME' ? 'onetimeCart' : 'subscriptionCart';
    return state[cartKey].filter((item) => item.isVisible !== 'N').length;
  },
}));
//장바구니 페이지에 방문할 때마다 api를 부르는 게 아니라 전역객체에서 가져와서 띄워주는 것
//대신, 장바구니 페이지에 방문할 때마다 api를 새로 호출해서 전역객체에 있는 정보를 업데이트

//get() >> 현재 상태와 함수를 스토어에서 직접 가져오므로 상태의 일관성을 유지하는 데 도움이 된다.
// >> 항상 최신 상태와 함수를 가져올 수 있다
export default useCartStore;
