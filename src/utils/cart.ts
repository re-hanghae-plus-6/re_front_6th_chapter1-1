export const CART_KEY = "cart_items";

import type { CartItem } from "../types/cart.ts";

export function getCartItems(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function setCartItems(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(productId: string, qty: number = 1, price?: number, title?: string) {
  const items = getCartItems();
  const idx = items.findIndex((it) => it.id === productId);
  if (idx > -1) {
    items[idx].qty += qty;
    if (price !== undefined) items[idx].price = price;
    if (title !== undefined) items[idx].title = title;
  } else {
    const newItem: CartItem = { id: productId, qty };
    if (price !== undefined) newItem.price = price;
    if (title !== undefined) newItem.title = title;
    items.push(newItem);
  }
  setCartItems(items);
}

export function getCartCount(): number {
  return getCartItems().reduce((sum, it) => sum + (it.qty ?? 0), 0);
}
