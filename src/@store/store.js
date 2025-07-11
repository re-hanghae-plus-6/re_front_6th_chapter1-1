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
