import { getRouteConfig } from "../routes.js";

export const ROUTE_ACTIONS = {
  SET_PAGE_LOADING: "SET_PAGE_LOADING",
  CHANGE_ROUTE: "CHANGE_ROUTE",
};

export const routeActions = {
  setPageLoading: (loadingState) => ({ type: ROUTE_ACTIONS.SET_PAGE_LOADING, payload: loadingState }),
  changeRoute: (route) => ({ type: ROUTE_ACTIONS.CHANGE_ROUTE, payload: route }),

  navigate: (route) => (dispatch) => {
    const routeConfig = getRouteConfig(route);
    if (routeConfig.loadingAction) {
      const loadingState = routeConfig.loadingAction();
      dispatch(routeActions.setPageLoading(loadingState));
    }

    dispatch(routeActions.changeRoute(route));
  },
};
