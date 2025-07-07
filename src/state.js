export const initialState = {
  products: [],
  loading: false,
  error: null,

  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },

  currentPage: "list",
};
