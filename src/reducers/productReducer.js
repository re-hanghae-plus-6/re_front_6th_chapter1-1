import { PRODUCT_ACTIONS } from "../actions/productActions.js";

export function productReducer(state, action) {
  switch (action.type) {
    case PRODUCT_ACTIONS.LOAD_INITIAL_DATA:
      return {
        ...state,
        loading: true,
        loadingCategories: true,
        error: null,
        categoriesError: null,
      };

    case PRODUCT_ACTIONS.INITIAL_DATA_LOADED: {
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

    case PRODUCT_ACTIONS.LOAD_INITIAL_DATA_ERROR:
      return {
        ...state,
        loading: false,
        loadingCategories: false,
        error: action.payload,
        categoriesError: action.payload,
      };

    case PRODUCT_ACTIONS.LOAD_PRODUCTS:
      return { ...state, loading: true, error: null };

    case PRODUCT_ACTIONS.PRODUCTS_LOADED: {
      const { products, pagination } = action.payload;

      return {
        ...state,
        loading: false,
        products: pagination.page === 1 ? products : [...state.products, ...products],
        pagination,
      };
    }

    case PRODUCT_ACTIONS.LOAD_ERROR:
      return { ...state, loading: false, error: action.payload };

    case PRODUCT_ACTIONS.CHANGE_FILTERS:
      return {
        ...state,
        loading: true,
        filters: { ...state.filters, ...action.payload },
        pagination: {
          ...state.pagination,
          page: 1,
          ...(action.payload.limit && { limit: action.payload.limit }),
        },
      };

    case PRODUCT_ACTIONS.CHANGE_LIMIT:
      return {
        ...state,
        loading: true,
        filters: { ...state.filters, limit: action.payload },
        pagination: {
          ...state.pagination,
          page: 1,
          limit: action.payload,
        },
      };

    case PRODUCT_ACTIONS.SLICE_LIST:
      return {
        ...state,
        products: state.products.slice(0, action.payload),
        pagination: { ...state.pagination, limit: action.payload },
      };

    case PRODUCT_ACTIONS.CHANGE_SORT:
      return {
        ...state,
        loading: true,
        filters: { ...state.filters, sort: action.payload },
      };

    case PRODUCT_ACTIONS.SEARCH_PRODUCTS:
      return {
        ...state,
        loading: true,
        filters: { ...state.filters, search: action.payload },
        pagination: {
          ...state.pagination,
          page: 1,
        },
      };

    case PRODUCT_ACTIONS.LOAD_PRODUCT_DETAIL:
      return {
        ...state,
        productDetail: {
          ...state.productDetail,
          loading: true,
          error: null,
        },
      };

    case PRODUCT_ACTIONS.PRODUCT_DETAIL_LOADED:
      return {
        ...state,
        productDetail: {
          ...state.productDetail,
          loading: false,
          product: action.payload,
          error: null,
        },
      };

    case PRODUCT_ACTIONS.LOAD_PRODUCT_DETAIL_ERROR:
      return {
        ...state,
        productDetail: {
          ...state.productDetail,
          loading: false,
          error: action.payload,
          product: null,
        },
      };

    case PRODUCT_ACTIONS.LOAD_RELATED_PRODUCTS:
      return {
        ...state,
        productDetail: {
          ...state.productDetail,
          relatedProducts: [],
          loadingRelatedProducts: true,
        },
      };

    case PRODUCT_ACTIONS.RELATED_PRODUCTS_LOADED:
      return {
        ...state,
        productDetail: {
          ...state.productDetail,
          relatedProducts: action.payload,
          loadingRelatedProducts: false,
        },
      };

    default:
      return state;
  }
}
