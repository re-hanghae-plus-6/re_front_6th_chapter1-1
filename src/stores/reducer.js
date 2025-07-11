import { ACTION_TYPES } from "./actions.js";

// 초기 상태 정의
export const initialState = {
  products: [],
  total: 0,
  loading: false,
  categories: {},
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
      };

    case ACTION_TYPES.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };

    default:
      return state;
  }
};
