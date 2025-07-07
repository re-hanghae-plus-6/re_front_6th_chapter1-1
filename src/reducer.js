import { ACTIONS } from "./actions.js";

export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOAD_PRODUCTS:
      return { ...state, loading: true, error: null };

    case ACTIONS.PRODUCTS_LOADED:
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        pagination: action.payload.pagination,
      };

    case ACTIONS.LOAD_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}
