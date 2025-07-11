import { render } from "../render";
import { store } from "../store";

export const addToCart = (product, quantity) => {
  let cartItems = store.getState("cartItems");
  const existingItem = cartItems.find((item) => item.productId === product.productId);

  if (existingItem) {
    existingItem.quantity += quantity;
    const newCartItems = cartItems.map((item) => (item.productId === product.productId ? existingItem : item));
    store.setState("cartItems", newCartItems, { persist: true });
  } else {
    store.setState("cartItems", [...store.getState("cartItems"), { ...product, quantity: quantity }], {
      persist: true,
    });
  }

  render();
};
