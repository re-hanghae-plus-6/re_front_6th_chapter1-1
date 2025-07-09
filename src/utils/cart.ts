export const CART_KEY = "cart_items";

export interface CartItem {
  id: string;
  qty: number;
  /** 단가(원). 테스트에서 총액 계산을 위해 저장 */
  price?: number;
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

export function addToCart(productId: string, qty: number = 1, price?: number) {
  const items = getCartItems();
  const idx = items.findIndex((it) => it.id === productId);
  if (idx > -1) {
    items[idx].qty += qty;
    // 가격이 새로 전달되면 업데이트 (undefined 체크)
    if (price !== undefined) items[idx].price = price;
  } else {
    const newItem: CartItem = { id: productId, qty };
    if (price !== undefined) newItem.price = price;
    items.push(newItem);
  }
  setCartItems(items);
}

export function getCartCount(): number {
  return getCartItems().reduce((sum, it) => sum + (it.qty ?? 0), 0);
}
