import { ACTIONS } from "./actions.js";

export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOAD_INITIAL_DATA:
      return {
        ...state,
        loading: true,
        loadingCategories: true,
        error: null,
        categoriesError: null,
      };

    case ACTIONS.INITIAL_DATA_LOADED: {
      const { categories, products, pagination } = action.payload;
      return {
        ...state,
        loading: false,
        loadingCategories: false,
        categories,
        products,
        pagination,
      };
    }

    case ACTIONS.LOAD_INITIAL_DATA_ERROR:
      return {
        ...state,
        loading: false,
        loadingCategories: false,
        error: action.payload,
        categoriesError: action.payload,
      };

    case ACTIONS.LOAD_PRODUCTS:
      return { ...state, loading: true, error: null };

    case ACTIONS.PRODUCTS_LOADED: {
      const { products, pagination } = action.payload;

      return {
        ...state,
        loading: false,
        products: pagination.page === 1 ? products : [...state.products, ...products],
        pagination,
      };
    }

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

    case ACTIONS.SEARCH_PRODUCTS:
      return {
        ...state,
        filters: { ...state.filters, search: action.payload },
        pagination: {
          ...state.pagination,
          page: 1,
        },
      };

    default:
      return state;
  }
}
