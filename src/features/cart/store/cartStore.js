import { createState } from "../../../utils/createState.js";
import { loadFromStorage } from "../../../utils/localStorage.js";

const CART_STORAGE_KEY = "shopping_cart";

const initialCartState = loadFromStorage(CART_STORAGE_KEY, {
  items: [],
  selectedItems: [],
  totalCount: 0,
  isModalOpen: false,
});

export const cartStore = createState(initialCartState);

export const getCartState = () => cartStore.getState();

export const updateCartState = (cartState) => {
  cartStore.setState({
    ...getCartState(),
    ...cartState,
  });
};

export const subscribeToCartState = (callback) => {
  return cartStore.subscribe(callback);
};

export const resetCartState = () => {
  cartStore.setState({
    items: [],
    selectedItems: [],
    totalCount: 0,
    isModalOpen: false,
  });
};
