import { ACTION_TYPES } from "./actions.js";

// 초기 상태 정의
export const initialState = {
  products: [],
  total: 0,
  loading: false,
  categories: {},
  isLoadingMore: false,
  isInitialLoad: true,
  pagination: {
    currentPage: 1,
    hasNext: true,
    limit: 20,
  },
  route: {
    name: "ProductList",
    path: "/",
    params: {},
  },
  productDetail: null,
  productDetailLoading: false,
  cart: [],
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
        isInitialLoad: false,
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

    case ACTION_TYPES.SET_ROUTE:
      return {
        ...state,
        route: action.payload,
      };

    case ACTION_TYPES.SET_PRODUCT_DETAIL:
      return {
        ...state,
        productDetail: action.payload,
        productDetailLoading: false,
      };

    case ACTION_TYPES.SET_PRODUCT_DETAIL_LOADING:
      return {
        ...state,
        productDetailLoading: action.payload,
      };

    case ACTION_TYPES.ADD_TO_CART: {
      const { productId } = action.payload;
      // 중복 상품 체크 - 이미 있으면 추가하지 않음
      if (state.cart.includes(productId)) {
        return state;
      }
      return {
        ...state,
        cart: [...state.cart, productId],
      };
    }

    case ACTION_TYPES.REMOVE_FROM_CART: {
      const { productId } = action.payload;
      return {
        ...state,
        cart: state.cart.filter((id) => id !== productId),
      };
    }

    case ACTION_TYPES.CLEAR_CART:
      return {
        ...state,
        cart: [],
      };

    default:
      return state;
  }
};
