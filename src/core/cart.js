import CartModal from "../components/cart/CartModal.js";
import { getProduct } from "../api/productApi.js";

// LocalStorage key 상수화
const STORAGE_KEY = "shopping_cart";

let cart = [];

// 현재 장바구니 상태를 LocalStorage 에 저장
function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

// 초기 로드 시 LocalStorage 로부터 장바구니 복원
function initStorage() {
  try {
    const items = localStorage.getItem(STORAGE_KEY);
    if (items) cart = JSON.parse(items);
  } catch {
    // 파싱 오류 시 안전하게 초기화
    cart = [];
  }
}

initStorage();

export function getCartItems() {
  syncFromStorage();
  return cart;
}

// 장바구니에 담긴 상품 종류 수를 반환 (동일 상품 중복은 1로 계산)
export function getCartCount() {
  syncFromStorage();
  return cart.length;
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
  // Ensure latest state from storage (tests may clear localStorage between runs)
  syncFromStorage();
  // 클릭 즉시 토스트 표시
  showToast("장바구니에 추가되었습니다");

  // 이미 카트에 존재하면 수량만 증가
  const existing = cart.find((item) => item.product.productId === productId);
  if (existing) {
    existing.quantity += quantity;
    persist();
    renderModalContent(); // 비동기 처리하지만 대기하지 않음
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
  syncFromStorage();
  const existing = cart.find((item) => item.product.productId === product.productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ product, quantity, selected: false });
  }
  persist();
  renderModalContent(); // 비동기 처리하지만 대기하지 않음 (성능상 이유)
  showToast("장바구니에 추가되었습니다");
  updateCartBadge();
}

export function updateQuantity(productId, newQty) {
  syncFromStorage();
  const item = cart.find((i) => i.product.productId === productId);
  if (!item) return;
  item.quantity = newQty < 1 ? 1 : newQty;
  persist();
}

export function removeItem(productId) {
  syncFromStorage();
  cart = cart.filter((i) => i.product.productId !== productId);
  persist();
  renderModalContent(); // 비동기 처리하지만 대기하지 않음
}

export async function clearCart() {
  syncFromStorage();
  cart = [];
  persist();

  // 장바구니 비우기 후 안정적으로 빈 상태 렌더링
  // 모달을 닫지 않고 빈 장바구니 상태를 표시하여 테스트 기대와 일치
  await renderModalContent();
}

export function toggleSelect(productId) {
  syncFromStorage();
  const item = cart.find((i) => i.product.productId === productId);
  if (!item) return;
  item.selected = !item.selected;
  persist();
  renderModalContent(); // 비동기 처리하지만 대기하지 않음
}

export async function selectAll(selected) {
  syncFromStorage();
  cart.forEach((i) => {
    i.selected = selected;
  });
  persist();
  await renderModalContent(); // DOM 렌더링 완료 보장
}

// Helper to keep in-memory cart in sync with localStorage (important for test isolation)
function syncFromStorage() {
  try {
    const items = localStorage.getItem(STORAGE_KEY);
    cart = items ? JSON.parse(items) : [];
  } catch {
    cart = [];
  }
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

function handleEsc(e) {
  if (e.key === "Escape") {
    closeCartModal();
  }
}

function handleModalClick(e) {
  // 모달 내부 클릭은 전역(document) 클릭 핸들러로 버블링되지 않도록 차단한다
  e.stopPropagation();
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
      renderModalContent(); // 비동기 처리하지만 대기하지 않음
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
      renderModalContent(); // 비동기 처리하지만 대기하지 않음
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

  // 전체 선택 - DOM 렌더링 완료 보장
  if (e.target.closest("#cart-modal-select-all-checkbox")) {
    const allChecked = e.target.checked;
    selectAll(allChecked).catch((error) => {
      console.error("Failed to select all items:", error);
    });
    return;
  }

  // 선택 삭제 - 배치 처리로 DOM 렌더링 최적화
  if (e.target.closest("#cart-modal-remove-selected-btn")) {
    const selectedIds = getSelectedIds();
    if (selectedIds.length > 0) {
      syncFromStorage();
      // 배치로 삭제하여 DOM 렌더링을 한 번만 수행
      cart = cart.filter((item) => !selectedIds.includes(item.product.productId));
      persist();

      // 모든 상품이 삭제되어도 모달을 유지하고 빈 상태 표시
      renderModalContent()
        .then(() => {
          updateCartBadge();
        })
        .catch((error) => {
          console.error("Failed to render modal content:", error);
          updateCartBadge();
        });
    }
    return;
  }

  // 전체 비우기 - 장바구니 비우기 후 모달 자동 닫기로 DOM 안정성 보장
  if (e.target.closest("#cart-modal-clear-cart-btn")) {
    clearCart()
      .then(() => {
        updateCartBadge();
      })
      .catch((error) => {
        console.error("Failed to clear cart:", error);
      });
    return;
  }
}

// 모달 컨텐츠를 이렇게 수동으로 렌더링하는 것 보다 isOpen 상태를 구독해서 외부에서 컨트롤 할 수 있게 개선해야함
function renderModalContent() {
  if (!cartContainer) return Promise.resolve();

  // UI 렌더를 여기서 관리하는게 마음에 안듦.. 리팩토링 대상
  const html = CartModal({
    cartItems: cart,
    selectedItems: getSelectedIds(),
    totalPrice: getTotalPrice(),
    selectedPrice: getSelectedPrice(),
  });

  // DOM 업데이트를 안정적으로 처리하여 e2e 테스트에서의 DOM detach 방지
  return new Promise((resolve) => {
    // 즉시 DOM 업데이트
    cartContainer.innerHTML = html;

    // requestAnimationFrame으로 브라우저 렌더링 완료까지 대기
    requestAnimationFrame(() => {
      // 한 번 더 대기하여 모든 DOM 업데이트가 완료되도록 보장
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

function ensureOverlay() {
  // 1) cartContainer 참조가 있으나 이미 DOM 에서 분리된 경우 → 정리
  if (cartContainer && !document.contains(cartContainer)) {
    cartContainer.removeEventListener("click", handleModalClick);
    cartContainer = null;
  }

  // 2) DOM 에 정상적으로 연결돼 있는 경우 그대로 사용
  if (cartContainer) return;

  // 3) 새 오버레이 생성
  cartContainer = document.createElement("div");
  cartContainer.className =
    "cart-modal-overlay fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center";
  cartContainer.style.display = "none";

  // 외부(오버레이) 클릭 - 모달 닫기
  cartContainer.addEventListener("click", (e) => {
    if (e.target === cartContainer) closeCartModal();
  });

  cartContainer.addEventListener("click", handleModalClick);

  // 테스트(jsdom)에서는 #root 내부, 실제 브라우저에서는 body 하위에도 문제없도록 처리
  const rootElement = document.querySelector("#root");
  (rootElement || document.body).appendChild(cartContainer);
}

// 모달 open
export function openCartModal() {
  ensureOverlay();
  renderModalContent(); // 비동기 처리하지만 대기하지 않음
  cartContainer.style.display = "flex";

  // 중복 등록 방지를 위해 먼저 제거 후 등록
  document.removeEventListener("keydown", handleEsc);
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
