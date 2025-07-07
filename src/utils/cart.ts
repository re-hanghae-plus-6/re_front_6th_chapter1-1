export const CART_KEY = "cart_items";

export interface CartItem {
  id: string;
  qty: number;
}

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

export function addToCart(productId: string, qty: number = 1) {
  const items = getCartItems();
  const idx = items.findIndex((it) => it.id === productId);
  if (idx > -1) items[idx].qty += qty;
  else items.push({ id: productId, qty });
  setCartItems(items);
}

export function getCartCount(): number {
  return getCartItems().reduce((sum, it) => sum + (it.qty ?? 0), 0);
}
