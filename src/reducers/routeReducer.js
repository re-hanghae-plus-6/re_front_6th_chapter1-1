import { ROUTE_ACTIONS } from "../actions/routeActions.js";

export function routeReducer(state, action) {
  switch (action.type) {
    case ROUTE_ACTIONS.SET_PAGE_LOADING: {
      return {
        ...state,
        ...action.payload,
        ...(action.payload.productDetail && {
          productDetail: {
            ...state.productDetail,
            ...action.payload.productDetail,
          },
        }),
      };
    }

    case ROUTE_ACTIONS.CHANGE_ROUTE: {
      const route = action.payload;

      const basePath = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";
      let fullPath;
      if (basePath && route.startsWith(basePath)) {
        fullPath = route;
      } else {
        fullPath = basePath + route;
      }

      if (location.pathname !== fullPath) {
        window.history.pushState(null, "", fullPath);
      }

      // 테스트 모드에서 홈으로 갈 때 기본 pagination 설정
      const defaultState =
        route === "/" && import.meta.env.MODE === "test"
          ? {
              ...state,
              pagination: {
                ...state.pagination,
                limit: 20,
                page: 1,
              },
            }
          : state;

      return {
        ...defaultState,
        currentRoute: route,
      };
    }

    default:
      return state;
  }
}
