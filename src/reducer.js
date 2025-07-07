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

    case ACTIONS.CHANGE_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: {
          ...state.pagination,
          page: 1,
          ...(action.payload.limit && { limit: action.payload.limit }),
        },
      };

    case ACTIONS.CHANGE_LIMIT:
      return {
        ...state,
        filters: { ...state.filters, limit: action.payload },
        pagination: {
          ...state.pagination,
          page: 1,
          limit: action.payload,
        },
      };

    case ACTIONS.SLICE_LIST:
      return {
        ...state,
        products: state.products.slice(0, action.payload),
        pagination: { ...state.pagination, limit: action.payload },
      };

    case ACTIONS.CHANGE_SORT:
      return {
        ...state,
        filters: { ...state.filters, sort: action.payload },
      };

    default:
      return state;
  }
}
