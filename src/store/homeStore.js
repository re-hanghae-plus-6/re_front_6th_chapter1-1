import { DEFAULT_LIMIT, DEFAULT_PAGE, DEFAULT_SORT } from "../constants";
import { createStore } from "../lib/Store";

const initialState = {
  // 상품 관련 상태
  products: {
    list: [],
    total: 0,
    isLoading: false,
    pagination: {
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
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

// 스토어 인스턴스 생성
export const homeStore = createStore(initialState);
