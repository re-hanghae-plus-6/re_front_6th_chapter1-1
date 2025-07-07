export const ACTIONS = {
  LOAD_PRODUCTS: "LOAD_PRODUCTS",
  PRODUCTS_LOADED: "PRODUCTS_LOADED",
  LOAD_ERROR: "LOAD_ERROR",
};

export const actions = {
  loadProducts: () => ({ type: ACTIONS.LOAD_PRODUCTS }),
  productsLoaded: (products) => ({ type: ACTIONS.PRODUCTS_LOADED, payload: products }),
  loadError: (error) => ({ type: ACTIONS.LOAD_ERROR, payload: error }),
};
