import { showToast } from "../../components/Toast.js";

export let cart = {};

export function loadCart() {
  try {
    cart = JSON.parse(localStorage.getItem("shopping_cart") || "{}");
  } catch {
    cart = {};
  }
}

export function saveCart() {
  localStorage.setItem("shopping_cart", JSON.stringify(cart));
}

export function updateCartBadge() {
  const btn = document.querySelector("#cart-icon-btn");
  if (!btn) return;
  btn.querySelector("span")?.remove();

  const count = Object.keys(cart).length;
  if (count) {
    const badge = document.createElement("span");
    badge.textContent = count;
    badge.className =
      "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center";
    btn.appendChild(badge);
  }
}

export function addToCart(product, qty = 1) {
  const { productId } = product;
  if (cart[productId]) cart[productId].quantity += qty;
  else cart[productId] = { product, quantity: qty };

  saveCart();
  updateCartBadge();
  showToast("장바구니에 추가되었습니다", "success");
}
