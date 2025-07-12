import { showToast } from "../components/Toast.js";

class CartService {
  constructor() {
    this.cart = {};
    this.loadFromStorage();
  }

  // 로컬스토리지에서 장바구니 불러오기
  loadFromStorage() {
    try {
      const stored = JSON.parse(localStorage.getItem("shopping_cart") || "{}");
      // 기존 객체 내용을 모두 제거하고, 저장된 데이터를 병합하여
      // cart 객체의 참조를 유지한다.
      Object.keys(this.cart).forEach((k) => delete this.cart[k]);
      Object.assign(this.cart, stored);
    } catch {
      Object.keys(this.cart).forEach((k) => delete this.cart[k]);
    }
  }

  // 로컬스토리지에 저장
  saveToStorage() {
    localStorage.setItem("shopping_cart", JSON.stringify(this.cart));
  }

  // 장바구니 배지 업데이트 (UI)
  updateBadge() {
    const btn = document.querySelector("#cart-icon-btn");
    if (!btn) return;
    btn.querySelector("span")?.remove();

    const count = Object.keys(this.cart).length;
    if (count) {
      const badge = document.createElement("span");
      badge.textContent = count;
      badge.className =
        "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center";
      btn.appendChild(badge);
    }
  }

  // 장바구니 추가
  add(product, qty = 1) {
    const { productId } = product;
    if (this.cart[productId]) this.cart[productId].quantity += qty;
    else this.cart[productId] = { product, quantity: qty };

    // 디버그 로그 제거

    this.saveToStorage();
    this.updateBadge();
    showToast("장바구니에 추가되었습니다", "success");
  }

  // 수량 변경 (절대 값 설정)
  setQuantity(productId, quantity) {
    if (!this.cart[productId]) return;
    if (quantity < 1) return;
    this.cart[productId].quantity = quantity;
    this.saveToStorage();
    this.updateBadge();
  }

  // 수량 증가
  increase(productId) {
    if (!this.cart[productId]) return;
    this.cart[productId].quantity += 1;
    this.saveToStorage();
    this.updateBadge();
  }

  // 수량 감소
  decrease(productId) {
    if (!this.cart[productId]) return;
    if (this.cart[productId].quantity === 1) return;
    this.cart[productId].quantity -= 1;
    this.saveToStorage();
    this.updateBadge();
  }

  // 항목 제거
  remove(productId) {
    if (!this.cart[productId]) return;
    delete this.cart[productId];
    this.saveToStorage();
    this.updateBadge();
  }

  // 전체 비우기
  clear() {
    Object.keys(this.cart).forEach((k) => delete this.cart[k]);
    this.saveToStorage();
    this.updateBadge();
  }

  // 장바구니 객체 가져오기 (참조)
  getCart() {
    return this.cart;
  }

  // 항목 수 반환
  getCount() {
    return Object.keys(this.cart).length;
  }
}

const cartService = new CartService();
export default cartService;
