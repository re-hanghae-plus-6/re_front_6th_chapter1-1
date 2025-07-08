export const createProductStore = (initialState = {}) => {
  let state = {
    products: [],
    loading: false,
    error: null,
    totalCount: 0,
    limit: 20,
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

  const getState = () => ({ ...state });

  const setState = (newState) => {
    state = { ...state, ...newState };
    subscribers.forEach((cb) => cb(getState()));
  };

  const setProducts = (products) => setState({ products });
  const setLoading = (loading) => setState({ loading });
  const setError = (error) => setState({ error });
  const setTotalCount = (totalCount) => setState({ totalCount });
  const setLimit = (limit) => setState({ limit });

  return {
    getState,
    setState,
    subscribe,
    setProducts,
    setLoading,
    setError,
    setTotalCount,
    setLimit,
  };
};

export const productStore = createProductStore();
