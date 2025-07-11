import { ACTION_TYPES } from "./actions.js";

// 초기 상태 정의
export const initialState = {
  products: [],
  total: 0,
  loading: false,
  categories: {},
  isLoadingMore: false,
  pagination: {
    currentPage: 1,
    hasNext: true,
    limit: 20,
  },
};

// 순수 함수로 구현된 리듀서
export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case ACTION_TYPES.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload.products,
        total: action.payload.total,
        loading: false,
        pagination: {
          ...state.pagination,
          currentPage: 1,
          hasNext: action.payload.products.length < action.payload.total,
        },
      };

    case ACTION_TYPES.SET_LOADING_MORE:
      return {
        ...state,
        isLoadingMore: action.payload,
      };

    case ACTION_TYPES.APPEND_PRODUCTS: {
      const newProducts = [...state.products, ...action.payload.products];
      return {
        ...state,
        products: newProducts,
        pagination: {
          ...state.pagination,
          currentPage: action.payload.pagination.page,
          hasNext: action.payload.pagination.hasNext ?? newProducts.length < state.total,
        },
        isLoadingMore: false,
      };
    }

    case ACTION_TYPES.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };

    default:
      return state;
  }
};
