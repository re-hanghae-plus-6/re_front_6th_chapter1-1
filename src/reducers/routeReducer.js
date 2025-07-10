import { ROUTE_ACTIONS } from "../actions/routeActions.js";

export const routeReducer = (state, action) => {
  switch (action.type) {
    case ROUTE_ACTIONS.NAVIGATE:
      if (location.pathname !== action.payload) {
        window.history.pushState(null, "", action.payload);
      }

      import("../controllers/index.js").then(({ controller }) => {
        controller.handleRouteChange(action.payload);
      });

      return {
        ...state,
        currentRoute: action.payload,
      };
    default:
      return state;
  }
};
