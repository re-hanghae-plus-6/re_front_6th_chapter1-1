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

export function showToast(msg = "장바구니에 추가되었습니다") {
  const toast = document.createElement("div");
  toast.textContent = msg;
  toast.className = "fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow z-50";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
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
  showToast();
}
