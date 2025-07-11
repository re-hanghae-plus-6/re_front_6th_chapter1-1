import { createStore } from "./createStore.js";

// Product Store 생성
export const productStore = createStore({
  // 상품 데이터
  products: [],
  total: 0,

  // UI 상태
  isLoading: false,
  error: null,

  // 필터 상태 (URL과 동기화)
  filters: {
    search: "",
    category1: "",
    category2: "",
    sort: "price_asc",
    limit: 20,
  },

  // 페이지네이션
  pagination: {
    currentPage: 1,
    hasNextPage: true,
  },
});

// Product Store 액션들
export const productActions = {
  // 필터 업데이트
  updateFilters: (newFilters) => {
    productStore.setState((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, currentPage: 1 }, // 필터 변경 시 페이지 리셋
      products: [], // 기존 데이터 클리어
    }));
  },

  // 상품 데이터 설정
  setProducts: (products, total, append = false) => {
    productStore.setState((state) => ({
      products: append ? [...state.products, ...products] : products,
      total,
      isLoading: false,
      error: null,
      filters: state.filters, // filters 보존
      pagination: {
        ...state.pagination,
        hasNextPage: (append ? state.products.length : 0) + products.length < total,
      },
    }));
  },

  // 로딩 상태 설정
  setLoading: (isLoading) => {
    productStore.setState((state) => ({
      ...state,
      isLoading,
    }));
  },

  // 에러 상태 설정
  setError: (error) => {
    productStore.setState((state) => ({
      ...state,
      error,
      isLoading: false,
    }));
  },

  // URL에서 상태 복원
  loadFromURL: (queryParams) => {
    const { search = "", sort = "price_asc", limit = "20", category1 = "", category2 = "" } = queryParams;

    productStore.setState({
      filters: {
        search,
        sort,
        limit: parseInt(limit),
        category1,
        category2,
      },
    });
  },
};
