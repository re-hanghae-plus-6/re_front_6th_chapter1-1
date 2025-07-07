export const ACTIONS = {
  LOAD_PRODUCTS: "LOAD_PRODUCTS",
  PRODUCTS_LOADED: "PRODUCTS_LOADED",
  LOAD_ERROR: "LOAD_ERROR",
  CHANGE_FILTERS: "CHANGE_FILTERS",
  SLICE_LIST: "SLICE_LIST",
};

export const actions = {
  loadProducts: () => ({ type: ACTIONS.LOAD_PRODUCTS }),
  productsLoaded: (products) => ({ type: ACTIONS.PRODUCTS_LOADED, payload: products }),
  loadError: (error) => ({ type: ACTIONS.LOAD_ERROR, payload: error }),
  changeFilters: (filters) => ({
    type: ACTIONS.CHANGE_FILTERS,
    payload: filters,
  }),
  sliceList: (limit) => ({ type: ACTIONS.SLICE_LIST, payload: limit }),
};
