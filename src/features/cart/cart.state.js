import cartService from "../../services/CartService.js";
// showToast 는 CartService 내부에서 호출됨

// CartService 의 카트 객체를 그대로 노출 (레거시 호환)
export const cart = cartService.getCart();

export function loadCart() {
  cartService.loadFromStorage();
}

export function saveCart() {
  cartService.saveToStorage();
}

export function updateCartBadge() {
  cartService.updateBadge();
}

export function addToCart(product, qty = 1) {
  cartService.add(product, qty);
}
