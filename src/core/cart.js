/**
 * 장바구니 관련 로직을 관리하는 모듈
 *
 * core 폴더에 있는게 맞나 싶은데 나중에 service 폴더로 이동할 예정
 */

import CartModal from "../components/cart/CartModal.js";
import { getProduct } from "../api/productApi.js";

let cart = [];

function persist() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function initStorage() {
  try {
    const items = localStorage.getItem("cart");
    if (items) cart = JSON.parse(items);
  } catch {
    throw new Error("Failed to load cart");
  }
}

initStorage();

export function getCartItems() {
  return cart;
}

export function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getSelectedIds() {
  return cart.filter((i) => i.selected).map((i) => i.product.productId);
}

function getTotalPrice() {
  return cart.reduce((sum, item) => sum + parseInt(item.product.lprice) * item.quantity, 0);
}

function getSelectedPrice() {
  return cart.reduce((sum, item) => sum + (item.selected ? parseInt(item.product.lprice) * item.quantity : 0), 0);
}

export async function addToCartById(productId, quantity = 1) {
  // 클릭 즉시 토스트 표시
  showToast("장바구니에 추가되었습니다");

  // 이미 카트에 존재하면 수량만 증가
  const existing = cart.find((item) => item.product.productId === productId);
  if (existing) {
    existing.quantity += quantity;
    persist();
    renderModalContent();
    updateCartBadge();
    return;
  }

  // 신규 상품 – API 로딩
  try {
    const product = await getProduct(productId);
    addToCart(product, quantity);
    updateCartBadge();
  } catch (err) {
    console.error("[Cart] Failed to fetch product info", err);
  }
}

export function addToCart(product, quantity = 1) {
  const existing = cart.find((item) => item.product.productId === product.productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ product, quantity, selected: false });
  }
  persist();
  renderModalContent();
  showToast("장바구니에 추가되었습니다");
  updateCartBadge();
}

export function updateQuantity(productId, newQty) {
  const item = cart.find((i) => i.product.productId === productId);
  if (!item) return;
  item.quantity = newQty < 1 ? 1 : newQty;
  persist();
}

export function removeItem(productId) {
  cart = cart.filter((i) => i.product.productId !== productId);
  persist();
  renderModalContent();
}

export function clearCart() {
  cart = [];
  persist();
  renderModalContent();
}

export function toggleSelect(productId) {
  const item = cart.find((i) => i.product.productId === productId);
  if (!item) return;
  item.selected = !item.selected;
  persist();
  renderModalContent();
}

export function selectAll(selected) {
  cart.forEach((i) => {
    i.selected = selected;
  });
  persist();
  renderModalContent();
}

// 토스트 헬퍼
export function showToast(message) {
  // remove existing
  const prev = document.querySelector(".toast-message");
  if (prev) prev.remove();

  const el = document.createElement("div");
  el.className =
    "toast-message fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg";
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => {
    el.remove();
  }, 3000);
}

export function updateCartBadge() {
  const cartBtn = document.querySelector("#cart-icon-btn");
  if (!cartBtn) return;

  let badge = cartBtn.querySelector("span");
  const count = getCartCount();

  if (count > 0) {
    if (!badge) {
      badge = document.createElement("span");
      badge.className =
        "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center";
      cartBtn.appendChild(badge);
    }
    badge.textContent = count.toString();
  } else if (badge) {
    badge.remove();
  }
}

let cartContainer = null;

// 간단하게 함수형으로 구현해보자
const onKey = (key, action) => (e) => e.key === key && action();
const handleEsc = onKey("Escape", closeCartModal);

function handleModalClick(e) {
  // 닫기 버튼
  if (e.target.closest("#cart-modal-close-btn")) {
    closeCartModal();
    return;
  }

  // 수량 +
  const incBtn = e.target.closest(".quantity-increase-btn");
  if (incBtn) {
    const pid = incBtn.getAttribute("data-product-id");
    const item = cart.find((i) => i.product.productId === pid);
    if (item) {
      const newQty = item.quantity + 1;
      updateQuantity(pid, newQty);
      const inputEl = incBtn.parentNode.querySelector(".quantity-input");
      if (inputEl) inputEl.value = newQty.toString();
      updateCartBadge();
      renderModalContent();
    }
    return;
  }

  // 수량 -
  const decBtn = e.target.closest(".quantity-decrease-btn");
  if (decBtn) {
    const pid = decBtn.getAttribute("data-product-id");
    const item = cart.find((i) => i.product.productId === pid);
    if (item && item.quantity > 1) {
      const newQty = item.quantity - 1;
      updateQuantity(pid, newQty);
      const inputEl = decBtn.parentNode.querySelector(".quantity-input");
      if (inputEl) inputEl.value = newQty.toString();
      updateCartBadge();
      renderModalContent();
    }
    return;
  }

  // 상품 삭제
  const delBtn = e.target.closest(".cart-item-remove-btn");
  if (delBtn) {
    const pid = delBtn.getAttribute("data-product-id");
    removeItem(pid);
    updateCartBadge();
    return;
  }

  // 개별 선택 체크박스
  const checkbox = e.target.closest(".cart-item-checkbox");
  if (checkbox) {
    const pid = checkbox.getAttribute("data-product-id");
    toggleSelect(pid);
    return;
  }

  // 전체 선택
  if (e.target.closest("#cart-modal-select-all-checkbox")) {
    const allChecked = e.target.checked;
    selectAll(allChecked);
    return;
  }

  // 선택 삭제
  if (e.target.closest("#cart-modal-remove-selected-btn")) {
    const selectedIds = getSelectedIds();
    selectedIds.forEach((pid) => removeItem(pid));
    updateCartBadge();
    return;
  }

  // 전체 비우기
  if (e.target.closest("#cart-modal-clear-cart-btn")) {
    clearCart();
    updateCartBadge();
    return;
  }
}

// 모달 컨텐츠를 이렇게 수동으로 렌더링하는 것 보다 isOpen 상태를 구독해서 외부에서 컨트롤 할 수 있게 개선해야함
function renderModalContent() {
  if (!cartContainer) return;
  const html = CartModal({
    cartItems: cart,
    selectedItems: getSelectedIds(),
    totalPrice: getTotalPrice(),
    selectedPrice: getSelectedPrice(),
  });
  cartContainer.innerHTML = html;
}

function ensureOverlay() {
  if (cartContainer) return;
  cartContainer = document.createElement("div");
  cartContainer.className =
    "cart-modal-overlay fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center";
  cartContainer.style.display = "none";

  // 외부(오버레이) 클릭 - 모달 닫기
  cartContainer.addEventListener("click", (e) => {
    if (e.target === cartContainer) {
      closeCartModal();
    }
  });

  cartContainer.addEventListener("click", handleModalClick);
  document.body.appendChild(cartContainer);
}

// 모달 open
export function openCartModal() {
  ensureOverlay();
  renderModalContent();
  cartContainer.style.display = "flex";
  document.addEventListener("keydown", handleEsc);
}

// 모달 close
export function closeCartModal() {
  if (!cartContainer) return;
  cartContainer.remove();
  cartContainer = null;
  document.removeEventListener("keydown", handleEsc);
}

updateCartBadge();
