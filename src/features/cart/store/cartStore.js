import { createState } from "../../../utils/createState.js";
import { loadFromStorage } from "../../../utils/localStorage.js";

export const CART_STORAGE_KEY = "shopping_cart";

const initialCartState = loadFromStorage(CART_STORAGE_KEY, {
  items: [],
  selectedItems: [],
  itemCount: 0,
  isModalOpen: false,
});

export const cartStore = createState(initialCartState);
