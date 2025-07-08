export const initialState = {
  products: [],
  loading: false,
  error: null,

  categories: [],
  loadingCategories: false,
  categoriesError: null,

  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },

  filters: {
    search: "",
    category1: "",
    category2: "",
    sort: "price_asc",
  },

  currentPage: "list",
};
