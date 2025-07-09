export const CART_ACTIONS = {
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  UPDATE_CART_QUANTITY: "UPDATE_CART_QUANTITY",
  TOGGLE_CART_ITEM_SELECTION: "TOGGLE_CART_ITEM_SELECTION",
  TOGGLE_ALL_CART_ITEMS: "TOGGLE_ALL_CART_ITEMS",
  CLEAR_CART: "CLEAR_CART",
  REMOVE_SELECTED_ITEMS: "REMOVE_SELECTED_ITEMS",
  SHOW_CART_MODAL: "SHOW_CART_MODAL",
  HIDE_CART_MODAL: "HIDE_CART_MODAL",
};

export const cartActions = {
  addToCart: (productId, quantity = 1) => ({
    type: CART_ACTIONS.ADD_TO_CART,
    payload: { productId, quantity },
  }),
  removeFromCart: (productId) => ({
    type: CART_ACTIONS.REMOVE_FROM_CART,
    payload: { productId },
  }),
  updateCartQuantity: (productId, quantity) => ({
    type: CART_ACTIONS.UPDATE_CART_QUANTITY,
    payload: { productId, quantity },
  }),
  toggleCartItemSelection: (productId) => ({
    type: CART_ACTIONS.TOGGLE_CART_ITEM_SELECTION,
    payload: { productId },
  }),
  toggleAllCartItems: (selected) => ({
    type: CART_ACTIONS.TOGGLE_ALL_CART_ITEMS,
    payload: { selected },
  }),
  clearCart: () => ({ type: CART_ACTIONS.CLEAR_CART }),
  removeSelectedItems: () => ({ type: CART_ACTIONS.REMOVE_SELECTED_ITEMS }),
  showCartModal: () => ({ type: CART_ACTIONS.SHOW_CART_MODAL }),
  hideCartModal: () => ({ type: CART_ACTIONS.HIDE_CART_MODAL }),
};
