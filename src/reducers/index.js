import { productReducer } from "./productReducer.js";
import { cartReducer } from "./cartReducer.js";
import { toastReducer } from "./toastReducer.js";
import { PRODUCT_ACTIONS } from "../actions/productActions.js";
import { CART_ACTIONS } from "../actions/cartActions.js";
import { TOAST_ACTIONS } from "../actions/index.js";

export function reducer(state, action) {
  if (Object.values(PRODUCT_ACTIONS).includes(action.type)) {
    return productReducer(state, action);
  }

  if (Object.values(CART_ACTIONS).includes(action.type)) {
    return cartReducer(state, action);
  }

  if (Object.values(TOAST_ACTIONS).includes(action.type)) {
    return toastReducer(state, action);
  }

  return state;
}
