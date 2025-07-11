export const createCartStore = (initialState = {}) => {
  let state = {
    items: [],
    totalCount: 0,
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
    notify();
  };

  const addToCart = (productId, quantity = 1) => {
    if (state.items[productId]) {
      return;
    }

    const newItems = { ...state.items, [productId]: quantity };
    const newTotalCount = Object.values(newItems).reduce((sum, count) => sum + count, 0);

    setState({
      items: newItems,
      totalCount: newTotalCount,
    });
  };

  return {
    getState,
    setState,
    subscribe,
    addToCart,
  };
};

export const cartStore = createCartStore();
