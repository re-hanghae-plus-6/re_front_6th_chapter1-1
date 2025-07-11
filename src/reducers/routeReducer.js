import { ROUTE_ACTIONS } from "../actions/routeActions.js";

export const routeReducer = (state, action) => {
  switch (action.type) {
    case ROUTE_ACTIONS.NAVIGATE: {
      const basePath = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

      let fullPath;
      if (basePath && action.payload.startsWith(basePath)) {
        fullPath = action.payload;
      } else {
        fullPath = basePath + action.payload;
      }

      if (location.pathname !== fullPath) {
        window.history.pushState(null, "", fullPath);
      }

      const defaultState =
        action.payload === "/" && import.meta.env.MODE === "test"
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
        currentRoute: action.payload,
      };
    }
    default:
      return state;
  }
};
