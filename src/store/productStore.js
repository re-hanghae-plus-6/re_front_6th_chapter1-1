export const createProductStore = (initialState = {}) => {
  let state = {
    products: [],
    loading: false,
    error: null,
    totalCount: 0,
    limit: 20,
    sort: "price_asc",
    search: "",
    page: 1,
    hasMore: true,
    category1: "",
    category2: "",
    categories: [],
    ...initialState,
  };

  const subscribers = [];

  const subscribe = (callback) => {
    subscribers.push(callback);
    return () => {
      const idx = subscribers.indexOf(callback);
      if (idx > -1) subscribers.splice(idx, 1);
    };
  };

  const notify = () => {
    subscribers.forEach((cb) => cb(getState()));
  };

  const getState = () => ({ ...state });

  const setState = (newState) => {
    state = { ...state, ...newState };
    subscribers.forEach((cb) => cb(getState()));
  };

  const setProducts = (newProducts, append = false) => {
    const currentProducts = getState().products;
    state.products = append ? [...currentProducts, ...newProducts] : newProducts;
    notify();
  };
  const setPage = (newPage) => {
    state.page = newPage;
    notify();
  };
  const setHasMore = (hasMore) => {
    state.hasMore = hasMore;
    notify();
  };

  const setLoading = (loading) => setState({ loading });
  const setError = (error) => setState({ error });
  const setTotalCount = (totalCount) => setState({ totalCount });
  const setLimit = (limit) => setState({ limit });
  const setSort = (sort) => setState({ sort });
  const setSearch = (search) => setState({ search });
  const setCategory1 = (category1) => setState({ category1 });
  const setCategory2 = (category2) => setState({ category2 });
  const setCategories = (categories) => setState({ categories });

  const resetState = () => {
    state = {
      products: [],
      loading: false,
      error: null,
      totalCount: 0,
      limit: 20,
      sort: "price_asc",
      search: "",
      page: 1,
      hasMore: true,
      category1: "",
      category2: "",
      categories: [],
    };
    notify();
  };

  return {
    getState,
    setState,
    subscribe,
    setProducts,
    setLoading,
    setError,
    setTotalCount,
    setLimit,
    setSort,
    setSearch,
    setPage,
    setHasMore,
    setCategory1,
    setCategory2,
    setCategories,
    resetState,
  };
};

export const productStore = createProductStore();
