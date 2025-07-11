export const ACTION_TYPES = {
  SET_LOADING: "SET_LOADING",
  SET_PRODUCTS: "SET_PRODUCTS",
  SET_LOADING_MORE: "SET_LOADING_MORE",
  APPEND_PRODUCTS: "APPEND_PRODUCTS",
  SET_CATEGORIES: "SET_CATEGORIES",
  SET_ROUTE: "SET_ROUTE",
  SET_PRODUCT_DETAIL: "SET_PRODUCT_DETAIL",
  SET_PRODUCT_DETAIL_LOADING: "SET_PRODUCT_DETAIL_LOADING",
};

// 액션 생성자 함수들 - 일관된 액션 객체 생성
export const actions = {
  setLoading: (isLoading) => ({
    type: ACTION_TYPES.SET_LOADING,
    payload: isLoading,
  }),

  setProducts: (products, total) => ({
    type: ACTION_TYPES.SET_PRODUCTS,
    payload: { products, total },
  }),

  setLoadingMore: (isLoadingMore) => ({
    type: ACTION_TYPES.SET_LOADING_MORE,
    payload: isLoadingMore,
  }),

  appendProducts: (products, pagination) => ({
    type: ACTION_TYPES.APPEND_PRODUCTS,
    payload: { products, pagination },
  }),

  setCategories: (categories) => ({
    type: ACTION_TYPES.SET_CATEGORIES,
    payload: categories,
  }),

  setRoute: (route) => ({
    type: ACTION_TYPES.SET_ROUTE,
    payload: route,
  }),

  setProductDetail: (product) => ({
    type: ACTION_TYPES.SET_PRODUCT_DETAIL,
    payload: product,
  }),

  setProductDetailLoading: (isLoading) => ({
    type: ACTION_TYPES.SET_PRODUCT_DETAIL_LOADING,
    payload: isLoading,
  }),
};
