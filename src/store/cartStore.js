import { createStore } from "./createStore.js";

// 초기 상태 - 고유한 상품 ID만 관리
const initialState = {
  productIds: [], // 고유한 상품 ID 저장
};

// 스토어 생성
export const cartStore = createStore(initialState);

// 액션 생성자
export const cartActions = {
  addToCart: (product) => {
    const currentState = cartStore.getState();
    const productId = product.id;

    // 이미 존재하는 상품인지 확인
    if (!currentState.productIds.includes(productId)) {
      cartStore.setState({
        productIds: [...currentState.productIds, productId],
      });
    }
  },

  removeFromCart: (productId) => {
    const currentState = cartStore.getState();
    cartStore.setState({
      productIds: currentState.productIds.filter((id) => id !== productId),
    });
  },

  clearCart: () => {
    cartStore.setState({
      productIds: [],
    });
  },
};

// 선택자
export const cartSelectors = {
  getTotalCount: () => {
    const state = cartStore.getState();
    return state.productIds.length;
  },

  getProductIds: () => {
    const state = cartStore.getState();
    return [...state.productIds];
  },
};
