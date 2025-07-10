import { store } from "../store.js";
import { actions } from "../actions/index.js";

export const showToastWithAutoHide = (message, type = "success", duration = 3000) => {
  store.dispatch(actions.showToast(message, type));

  setTimeout(() => {
    store.dispatch(actions.hideToast());
  }, duration);
};
