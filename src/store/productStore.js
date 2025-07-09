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
    resetState,
  };
};

export const productStore = createProductStore();
