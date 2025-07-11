export const createCartStore = (initialState = {}) => {
  let state = {
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

  // 장바구니에 상품 추가
  const addToCart = (product, quantity = 1) => {
    const newTotalCount = state.totalCount + quantity;
    setState({ totalCount: newTotalCount });
  };

  return {
    getState,
    setState,
    subscribe,
    addToCart,
  };
};

export const cartStore = createCartStore();
