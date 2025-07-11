let state = {
  products: [],
  total: 0,
  loading: false,
  categories: [],
  categoriesLoading: false,
  searchValue: "",
  selectedCategory1: "",
  selectedCategory2: "",
  selectedSort: "price_asc",
  selectedLimit: "20",
  currentPage: 1,
  hasMore: true,
  cartCount: 0
};

const listeners = [];

const store = {
  getState() {
    return { ...state };
  },
  setState(newState) {
    state = { ...state, ...newState };
    listeners.forEach((listener) => listener(state));
  },
  subscribe(listener) {
    listeners.push(listener);
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx > -1) listeners.splice(idx, 1);
    };
  },
};

export default store;
