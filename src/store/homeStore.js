import { DEFAULT_LIMIT, DEFAULT_PAGE, DEFAULT_SORT } from "../constants";
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

  // 필터 및 정렬 상태
  filter: {
    search: "",
    category1: "",
    category2: "",
    sort: DEFAULT_SORT,
    limit: DEFAULT_LIMIT,
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
