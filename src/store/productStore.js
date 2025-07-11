import { createStore } from "./createStore.js";

console.log("🏪 ProductStore 초기화 시작...");

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

console.log("🏪 ProductStore 생성 완료. 초기 상태:", productStore.getState());

// Product Store 액션들
export const productActions = {
  // 필터 업데이트
  updateFilters: (newFilters) => {
    console.log("🔍 필터 업데이트 요청:", newFilters);

    productStore.setState((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, currentPage: 1 }, // 필터 변경 시 페이지 리셋
      products: [], // 기존 데이터 클리어
    }));
  },

  // 상품 데이터 설정
  setProducts: (products, total, append = false) => {
    console.log("📦 상품 데이터 설정:", {
      상품수: products.length,
      총개수: total,
      추가모드: append,
    });

    productStore.setState((state) => ({
      products: append ? [...state.products, ...products] : products,
      total,
      isLoading: false,
      error: null,
      pagination: {
        ...state.pagination,
        hasNextPage: (append ? state.products.length : 0) + products.length < total,
      },
    }));
  },

  // 로딩 상태 설정
  setLoading: (isLoading) => {
    console.log("⏳ 로딩 상태 변경:", isLoading);
    productStore.setState({ isLoading });
  },

  // 에러 상태 설정
  setError: (error) => {
    console.log("❌ 에러 발생:", error);
    productStore.setState({ error, isLoading: false });
  },

  // URL에서 상태 복원
  loadFromURL: (queryParams) => {
    console.log("🔗 URL에서 상태 복원:", queryParams);

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
