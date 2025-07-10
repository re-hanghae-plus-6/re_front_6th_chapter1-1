export const state = {
  // 공통
  cart: [],
  cartCount: 0,

  // Home 관련
  page: 1,
  products: [],
  categories: [],
  total: 0,
  isLoading: true,
  selectedLimit: "20",
  allLoaded: false,
  search: "",
  selectedCategory1: "",
  selectedCategory2: "",
  selectedSort: "price_asc",

  // Product 관련
  product: null,
  relatedProducts: [],
  selectProduct: null,
};

// 여러 key를 한 번에 수정할 수 있는 setState 함수
export function setState(updates) {
  Object.assign(state, updates);
}
