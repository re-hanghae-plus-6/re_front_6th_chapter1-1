import { cartState } from "./cartState";

export const cartStore = {
  addItem: (item) => {
    const items = cartState.getState();
    const existing = items.find((i) => i.productId === item.productId);

    let updatedItems;

    if (existing) {
      updatedItems = items.map((i) =>
        i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i,
      );
    } else {
      updatedItems = [...items, { ...item }];
    }

    cartState.setState(updatedItems);
  },

  deleteItem: (productId) => {
    const items = cartState.getState();
    const updatedItems = items.filter((i) => i.productId !== productId);

    cartState.setState(updatedItems);
  },

  updateQuantity: (productId, quantity) => {
    const items = cartState.getState();
    const updatedItems = items.map((i) => {
      if (i.productId === productId) {
        const limitedQty = Math.min(Math.max(1, quantity), i.stock);
        return { ...i, quantity: limitedQty };
      }
      return i;
    });

    cartState.setState(updatedItems);
  },

  clearItem: () => {
    cartState.setState([]);
  },

  subscribe: (callback) => cartState.subscribe(callback),
  getState: () => cartState.getState(),
};

export function getCartCount() {
  const items = cartStore.getState();
  return items.length;
}
