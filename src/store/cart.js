import { getFromLocalStorage, setToLocalStorage } from "../utils/localStorage.js";
import { useState } from "../hooks/useState.js";

export const SHOPPING_CART_KEY = "shopping_cart";

const initialCartState = getFromLocalStorage(SHOPPING_CART_KEY, {
  items: [],
  selectedItems: [],
  itemCount: 0,
  isModalOpen: false,
});

export const cartStore = useState(initialCartState);

const saveToLocalStorage = (state) => {
  setToLocalStorage(SHOPPING_CART_KEY, state);
};

export const addToCart = (product, quantity = 1) => {
  const currentState = cartStore.getState();
  const existingItemIndex = currentState.items.findIndex((item) => item.productId === product.productId);

  let newItems;
  if (existingItemIndex >= 0) {
    newItems = [...currentState.items];
    newItems[existingItemIndex] = {
      ...newItems[existingItemIndex],
      quantity: newItems[existingItemIndex].quantity + quantity,
    };
  } else {
    newItems = [
      ...currentState.items,
      {
        ...product,
        quantity,
        id: product.productId,
      },
    ];
  }

  const newItemCount = newItems.length;

  const newState = {
    ...currentState,
    items: newItems,
    itemCount: newItemCount,
  };

  cartStore.setState(newState);
  saveToLocalStorage(newState);
};

export const removeFromCart = (productId) => {
  const currentState = cartStore.getState();
  const newItems = currentState.items.filter((item) => item.productId !== productId);
  const newItemCount = newItems.length;

  const newState = {
    ...currentState,
    items: newItems,
    itemCount: newItemCount,
  };

  cartStore.setState(newState);
  saveToLocalStorage(newState);
};

export const updateCartItemQuantity = (productId, quantity) => {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  const currentState = cartStore.getState();
  const newItems = currentState.items.map((item) => (item.productId === productId ? { ...item, quantity } : item));
  const newItemCount = newItems.length;

  const newState = {
    ...currentState,
    items: newItems,
    itemCount: newItemCount,
  };

  cartStore.setState(newState);
  saveToLocalStorage(newState);
};

export const clearCart = () => {
  const newState = {
    items: [],
    selectedItems: [],
    itemCount: 0,
    isModalOpen: false,
  };

  cartStore.setState(newState);
  saveToLocalStorage(newState);
};
