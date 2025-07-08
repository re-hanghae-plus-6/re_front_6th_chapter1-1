import { productReducer } from "./productReducer.js";
import { cartReducer } from "./cartReducer.js";
import { PRODUCT_ACTIONS } from "../actions/productActions.js";
import { CART_ACTIONS } from "../actions/cartActions.js";

export function reducer(state, action) {
  if (Object.values(PRODUCT_ACTIONS).includes(action.type)) {
    return productReducer(state, action);
  }

  if (Object.values(CART_ACTIONS).includes(action.type)) {
    return cartReducer(state, action);
  }

  return state;
}
