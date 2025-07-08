export const createStore = (initialState) => {
  return {
    state: { ...initialState, isLoading: false, error: null },
    listeners: [],
    setState(newState) {
      this.state = { ...this.state, ...newState };
      this.listeners.forEach((fn) => fn(this.state));
    },
    subscribe(fn) {
      this.listeners.push(fn);
    },
  };
};

export const DEFAULT_LIMIT = 20;

export const productsStore = createStore({
  filters: {
    category1: "",
    category2: "",
    search: "",
    sort: "price_asc",
  },
  pagination: {
    hasNext: false,
    hasPrev: false,
    limit: DEFAULT_LIMIT,
    page: 1,
    total: 0,
    totalPages: 0,
  },
  products: [],
  isLoading: false,
  error: null,
});

export const categoriesStore = createStore({
  categories: {},
  isLoading: false,
  error: null,
});
