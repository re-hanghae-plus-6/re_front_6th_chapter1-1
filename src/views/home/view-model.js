export class HomePageViewModel {
  static INITIAL_STATE = {
    loading: true,
    isError: false,
    products: [],
    categories: [],
    pagination: { hasNext: false, hasPrev: false, limit: 20, page: 1, total: 0, totalPages: 0 },
    filters: {
      search: "",
      category1: "",
      category2: "",
      sort: "price_asc",
    },
  };

  static MESSAGES = {
    LOADING_CATEGORIES: "카테고리 로딩 중...",
    LOADING_PRODUCTS: "상품을 불러오는 중...",
    LOADING_MORE_PRODUCTS: "상품을 불러오는 중...",
    LOAD_MORE_ERROR: "상품을 불러오는데 실패했습니다.",
    ALL_PRODUCTS_LOADED: "모든 상품을 확인했습니다",
    CART_SUCCESS: "장바구니에 추가되었습니다",
    ERROR_GENERAL: "오류가 발생했습니다. 다시 시도해주세요.",
    ERROR_PRODUCT_ID: "상품 ID를 찾을 수 없습니다.",
    ERROR_PRODUCT_INFO: "상품 정보를 찾을 수 없습니다.",
    REFRESH_BUTTON: "새로고침",
    SEARCH_PLACEHOLDER: "상품명을 검색해보세요...",
    CART_BUTTON: "장바구니 담기",
    CATEGORY_ALL: "전체",
    COUNT_LABEL: "개수:",
    SORT_LABEL: "정렬:",
    CATEGORY_LABEL: "카테고리:",
    TOTAL_PRODUCTS: "총",
    PRODUCTS_UNIT: "개",
    PRODUCTS_SUFFIX: "의 상품",
  };

  static SORT_OPTIONS = [
    { value: "price_asc", label: "가격 낮은순" },
    { value: "price_desc", label: "가격 높은순" },
    { value: "name_asc", label: "이름순" },
    { value: "name_desc", label: "이름 역순" },
  ];

  static LIMIT_OPTIONS = [10, 20, 50, 100];

  static DEBOUNCE_TIME = 300;
}
