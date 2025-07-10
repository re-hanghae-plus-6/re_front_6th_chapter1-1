import { ROUTE_ACTIONS } from "../actions/routeActions.js";

export const routeReducer = (state, action) => {
  switch (action.type) {
    case ROUTE_ACTIONS.NAVIGATE: {
      if (location.pathname !== action.payload) {
        window.history.pushState(null, "", action.payload);
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
