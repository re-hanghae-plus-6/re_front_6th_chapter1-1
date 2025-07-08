export const ACTIONS = {
  LOAD_INITIAL_DATA: "LOAD_INITIAL_DATA",
  INITIAL_DATA_LOADED: "INITIAL_DATA_LOADED",
  LOAD_INITIAL_DATA_ERROR: "LOAD_INITIAL_DATA_ERROR",

  LOAD_PRODUCTS: "LOAD_PRODUCTS",
  PRODUCTS_LOADED: "PRODUCTS_LOADED",
  LOAD_ERROR: "LOAD_ERROR",
  CHANGE_FILTERS: "CHANGE_FILTERS",
  CHANGE_LIMIT: "CHANGE_LIMIT",
  SLICE_LIST: "SLICE_LIST",
  CHANGE_SORT: "CHANGE_SORT",
  SEARCH_PRODUCTS: "SEARCH_PRODUCTS",

  LOAD_PRODUCT_DETAIL: "LOAD_PRODUCT_DETAIL",
  PRODUCT_DETAIL_LOADED: "PRODUCT_DETAIL_LOADED",
  LOAD_PRODUCT_DETAIL_ERROR: "LOAD_PRODUCT_DETAIL_ERROR",
  LOAD_RELATED_PRODUCTS: "LOAD_RELATED_PRODUCTS",
  RELATED_PRODUCTS_LOADED: "RELATED_PRODUCTS_LOADED",
};

export const actions = {
  loadInitialData: () => ({ type: ACTIONS.LOAD_INITIAL_DATA }),
  initialDataLoaded: (data) => ({ type: ACTIONS.INITIAL_DATA_LOADED, payload: data }),
  loadInitialDataError: (error) => ({ type: ACTIONS.LOAD_INITIAL_DATA_ERROR, payload: error }),

  loadProducts: () => ({ type: ACTIONS.LOAD_PRODUCTS }),
  productsLoaded: (data) => ({ type: ACTIONS.PRODUCTS_LOADED, payload: data }),
  loadError: (error) => ({ type: ACTIONS.LOAD_ERROR, payload: error }),
  changeFilters: (filters) => ({
    type: ACTIONS.CHANGE_FILTERS,
    payload: filters,
  }),
  changeLimit: (limit) => ({ type: ACTIONS.CHANGE_LIMIT, payload: limit }),
  sliceList: (limit) => ({ type: ACTIONS.SLICE_LIST, payload: limit }),
  changeSorts: (sort) => ({ type: ACTIONS.CHANGE_SORT, payload: sort }),
  searchProducts: (searchTerm) => ({ type: ACTIONS.SEARCH_PRODUCTS, payload: searchTerm }),

  loadProductDetail: () => ({ type: ACTIONS.LOAD_PRODUCT_DETAIL }),
  productDetailLoaded: (data) => ({ type: ACTIONS.PRODUCT_DETAIL_LOADED, payload: data }),
  loadProductDetailError: (error) => ({ type: ACTIONS.LOAD_PRODUCT_DETAIL_ERROR, payload: error }),
  loadRelatedProducts: () => ({ type: ACTIONS.LOAD_RELATED_PRODUCTS }),
  relatedProductsLoaded: (products) => ({ type: ACTIONS.RELATED_PRODUCTS_LOADED, payload: products }),
};
