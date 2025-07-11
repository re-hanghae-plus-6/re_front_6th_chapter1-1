const createStore = (initialState) => {
  let state = initialState;
  const listeners = new Set();

  const getState = () => state;

  const dispatch = (action) => {
    state = { ...state, ...action.payload };

    listeners.forEach((listener) => listener(state));
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { getState, dispatch, subscribe };
};

const initialState = {
  categories: {},
  products: [],
  total: 0,
  loading: false,
  isFetchingMore: false,
  hasMore: true,
  selectedCategory1: null,
  selectedCategory2: null,
  cartItemCount: 0,
  currentLimit: 20,
  currentSort: "price_asc",
  currentSearch: "",
  currentPage: 1,
};

export const store = createStore(initialState);

export const resetStoreState = () => {
  Object.assign(store.getState(), initialState);
  store.dispatch({ payload: initialState });
};
