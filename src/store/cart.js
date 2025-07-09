import { getFromLocalStorage } from "../utils/localStorage";
import { createState } from "../utils/state";

export const SHOPPING_CART_KEY = "@hanghae99/shopping-cart";

const initialCartState = getFromLocalStorage(SHOPPING_CART_KEY, {
  items: [],
  selectedItems: [],
  totalCount: 0,
  isModalOpen: false,
});

export const cartStore = createState(initialCartState);
