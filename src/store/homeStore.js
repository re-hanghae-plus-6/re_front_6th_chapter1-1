import { DEFAULT_PAGE } from "../constants";
import Store from "../lib/Store";

const homeState = {
  // 상품 관련 상태
  products: {
    list: [],
    total: 0,
    isProductsLoading: false,
    pagination: {
      page: DEFAULT_PAGE,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
  },

  // 카테고리 관련 상태
  categories: {
    categoryList: [],
    isCategoryLoading: false,
  },

  // 장바구니 상태
  cart: {
    items: [],
    selectedItems: [],
    totalPrice: 0,
    selectedPrice: 0,
  },
};

// 싱글톤 인스턴스를 생성해서 export
export const homeStore = new Store(homeState);

export const resetHomeStore = () => {
  homeStore.reset(homeState);
};
