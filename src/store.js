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

const loadStateFromLocalStorage = () => {
  try {
    const serializedLimit = localStorage.getItem("currentLimit");
    const limit = serializedLimit ? parseInt(serializedLimit, 10) : 20;

    const serializedSort = localStorage.getItem("currentSort");
    const sort = serializedSort || "price_asc";

    const serializedCart = localStorage.getItem("cart");
    const cart = serializedCart ? JSON.parse(serializedCart) : [];
    const cartItemCount = cart.length;

    return {
      categories: {},
      products: [],
      total: 0,
      loading: false,
      isFetchingMore: false,
      hasMore: true,
      selectedCategory1: null,
      selectedCategory2: null,
      cartItemCount: cartItemCount,
      currentLimit: limit,
      currentSort: sort,
      currentSearch: "",
      currentPage: 1,
      currentDetailProduct: {},
    };
  } catch (error) {
    console.log("로컬 스토리지 오류 : ", error);
    return {
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
      currentDetailProduct: {},
    };
  }
};

const initialState = loadStateFromLocalStorage();

export const store = createStore(initialState);

export const resetStoreState = () => {
  const resetToState = loadStateFromLocalStorage();
  store.dispatch({ type: "RESET_STATE", payload: resetToState });
};
