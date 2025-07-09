import { PRODUCT_ACTIONS, productActions } from "./productActions.js";
import { CART_ACTIONS, cartActions } from "./cartActions.js";
import { TOAST_ACTIONS, toastActions } from "./toastActions.js";

export const ACTIONS = {
  ...PRODUCT_ACTIONS,
  ...CART_ACTIONS,
  ...TOAST_ACTIONS,
};

export const actions = {
  ...productActions,
  ...cartActions,
  ...toastActions,
};

export { PRODUCT_ACTIONS, productActions };
export { CART_ACTIONS, cartActions };
export { TOAST_ACTIONS, toastActions };
