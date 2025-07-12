import { TOAST_ACTIONS } from "../actions/index.js";

export function toastReducer(state, action) {
  switch (action.type) {
    case TOAST_ACTIONS.SHOW_TOAST:
      return {
        ...state,
        toast: {
          isVisible: true,
          type: action.payload.toastType,
          message: action.payload.message,
        },
      };

    case TOAST_ACTIONS.HIDE_TOAST:
      return {
        ...state,
        toast: {
          isVisible: false,
          message: "",
        },
      };

    default:
      return state;
  }
}
