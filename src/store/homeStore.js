import { DEFAULT_PAGE } from "../constants";
import Store from "../lib/Store";

export const PRODUCT_LIST_MODE = {
  INITIAL: "INITIAL",
  INFINITE_SCROLL: "INFINITE_SCROLL",
};

const homeState = {
  // 상품 관련 상태
  products: {
    list: [],
    total: 0,
    isProductsLoading: false,
    isMoreProductsLoading: false,
    pagination: {
      page: DEFAULT_PAGE,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
    productListMode: PRODUCT_LIST_MODE.INITIAL,
  },

  // 카테고리 관련 상태
  categories: {
    categoryList: [],
    isCategoryLoading: false,
  },

  // 장바구니 상태
  cart: {
    items: [], // 상품 객체 목록
    selectedItems: [], // id목록
  },
};

// 싱글톤 인스턴스를 생성해서 export
export const homeStore = new Store(homeState);

export const resetHomeStore = () => {
  homeStore.reset(homeState);
};
