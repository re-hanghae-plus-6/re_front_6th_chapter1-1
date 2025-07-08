import { PRODUCT_ACTIONS, productActions } from "./productActions.js";
import { CART_ACTIONS, cartActions } from "./cartActions.js";

export const ACTIONS = {
  ...PRODUCT_ACTIONS,
  ...CART_ACTIONS,
};

export const actions = {
  ...productActions,
  ...cartActions,
};

export { PRODUCT_ACTIONS, productActions };
export { CART_ACTIONS, cartActions };
