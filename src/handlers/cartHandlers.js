// cartHandlers.js

import cart from "../@store/cart";
import { CartModal } from "../components/cart/CartModal";

// 장바구니 열기 핸들러
export function viewCartHandler(state) {
  const cartIcon = document.getElementById("cart-icon-btn");
  if (!cartIcon) return;
  cartIcon.addEventListener("click", () => {
    CartModal(state);
    setupQuantityButtons(state);
    closeCartModal();
  });
}

// 장바구니 모달 닫기 핸들러
export function closeCartModal() {
  const modalPortal = document.getElementById("modal-portal");
  const cartModalCloseBtn = document.getElementById("cart-modal-close-btn");
  const cartModalBackground = document.querySelector(".cart-modal-overlay");

  if (cartModalCloseBtn) {
    cartModalCloseBtn.addEventListener("click", () => {
      if (modalPortal) modalPortal.innerHTML = "";
    });
  }

  if (cartModalBackground) {
    cartModalBackground.addEventListener("click", (e) => {
      if (e.target === cartModalBackground && modalPortal) {
        modalPortal.innerHTML = "";
      }
    });
  }

  const escListener = (e) => {
    if (e.key === "Escape" && modalPortal) {
      modalPortal.innerHTML = "";
      document.removeEventListener("keydown", escListener); // 이벤트 제거
    }
  };

  document.addEventListener("keydown", escListener);
}

// 수량 증가/감소 버튼 셋업
export function setupQuantityButtons(state) {
  const itemMap = new Map();

  cart.state.forEach((item) => {
    if (itemMap.has(item.productId)) {
      itemMap.get(item.productId).quantity += 1;
    } else {
      itemMap.set(item.productId, { ...item, quantity: 1 });
    }
  });

  document.querySelectorAll(".quantity-increase-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
      const priceEl = document.querySelector(`.item-price[data-product-id="${productId}"]`);
      const item = itemMap.get(productId);

      item.quantity += 1;
      input.value = item.quantity;
      priceEl.textContent = `${item.lprice * item.quantity}원`;
      updateTotal(itemMap);

      // 상태에 반영 (필요 시)
      updateCartStateQuantity(state, productId, item.quantity);
    });
  });

  document.querySelectorAll(".quantity-decrease-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
      const priceEl = document.querySelector(`.item-price[data-product-id="${productId}"]`);
      const item = itemMap.get(productId);

      if (item.quantity > 1) {
        item.quantity -= 1;
        input.value = item.quantity;
        priceEl.textContent = `${item.lprice * item.quantity}원`;
        updateTotal(itemMap);

        // 상태에 반영 (필요 시)
        updateCartStateQuantity(state, productId, item.quantity);
      }
    });
  });

  updateTotal(itemMap);
}

// 총 합계 업데이트
export function updateTotal(itemMap) {
  const totalPrice = Array.from(itemMap.values()).reduce((sum, item) => sum + item.lprice * item.quantity, 0);
  const totalQuantity = Array.from(itemMap.values()).reduce((sum, item) => sum + item.quantity, 0);

  const totalPriceEl = document.querySelector(".text-xl.font-bold.text-blue-600");
  const totalQuantitySpan = document.querySelector("h2 span");
  const selectAllLabel = document.querySelector("#cart-modal-select-all-checkbox")?.nextSibling;

  if (totalPriceEl) totalPriceEl.textContent = `${totalPrice}원`;
  if (totalQuantitySpan) totalQuantitySpan.textContent = `(${totalQuantity})`;
  if (selectAllLabel) selectAllLabel.textContent = `전체선택 (${totalQuantity}개)`;
}

// 장바구니 수량 상태 반영 함수
function updateCartStateQuantity(state, productId, quantity) {
  // cart.state에서 productId에 해당하는 아이템 수량 업데이트
  cart.setState(cart.state.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
  // 수량 변경에 따른 카운트 업데이트
  updateCartCount();
}

// 장바구니 아이콘 숫자 업데이트
export function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (!countEl) return;

  const total = cart.state.length;
  countEl.textContent = total;

  if (total === 0) {
    countEl.classList.add("hidden");
  } else {
    countEl.classList.remove("hidden");
  }
}

/** 장바구니 담기 */
export function addToCart(productId, state) {
  const product = state.products.find((p) => p.productId === productId);
  if (!product) return;

  const exists = cart.state.some((item) => item.productId === productId);
  if (!exists) {
    cart.setState([...cart.state, { ...product, quantity: 1 }]);
  } else {
    cart.setState(
      cart.state.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)),
    );
  }

  localStorage.setItem("cart", JSON.stringify(cart.state));
  updateCartCount(cart.state);
  showAddToCartToast();
}

// 장바구니 담기 버튼 핸들러
export function addToCartHandler(state) {
  const buttons = document.querySelectorAll(".add-to-cart-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.productId;
      const product = state.products.find((p) => p.productId === productId);

      if (product) {
        // 중복 추가 방지
        const exists = cart.state.some((item) => item.productId === productId);
        if (!exists) {
          cart.setState([...cart.state, { ...product, quantity: 1 }]);
        } else {
          cart.setState(
            cart.state.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)),
          );
        }

        localStorage.setItem("cart", JSON.stringify(cart.state));

        updateCartCount(cart.state);
        showAddToCartToast();
      }
    });
  });
}

/** 삭제버튼 클릭시 제거 */
export function removeSelectedHandler(state) {
  document.querySelectorAll(".cart-item-remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.productId;

      const changedState = cart.state.filter((item) => item.productId !== productId);

      // cart에서 해당 productId 제거
      cart.setState(changedState);

      // 장바구니 모달 다시 실행
      CartModal(state);

      updateCartCount();
    });
  });
}
/** 선택된 상품 삭제 */
export function handleRemoveSelectedItems(state) {
  const removeBtn = document.querySelector("#cart-modal-remove-selected-btn");
  if (!removeBtn) return;

  removeBtn.addEventListener("click", () => {
    const checkedBoxes = document.querySelectorAll(".cart-item-checkbox:checked");
    const selectedIds = Array.from(checkedBoxes).map((cb) => cb.dataset.productId);
    if (selectedIds.length === 0) return;

    cart.state = cart.state.filter((item) => !selectedIds.includes(item.productId));
    localStorage.setItem("cart", JSON.stringify(cart.state));
    CartModal(state);
    updateCartCount();
  });
}

/** 전체 선택 */
export function handleSelectAllCheckbox() {
  const allCheckbox = document.querySelector("#cart-modal-select-all-checkbox");
  if (!allCheckbox) return;

  allCheckbox.addEventListener("change", () => {
    const itemCheckboxes = document.querySelectorAll(".cart-item-checkbox");
    const isAllChecked = allCheckbox.checked;
    itemCheckboxes.forEach((cb) => {
      cb.checked = isAllChecked;
    });
  });

  // 각 개별 체크박스가 변경될 때 전체선택 체크박스 상태도 동기화
  document.querySelectorAll(".cart-item-checkbox").forEach((cb) => {
    cb.addEventListener("change", () => {
      const itemCheckboxes = document.querySelectorAll(".cart-item-checkbox");
      const checkedCount = Array.from(itemCheckboxes).filter((c) => c.checked).length;
      if (checkedCount === itemCheckboxes.length) {
        allCheckbox.checked = true;
      } else {
        allCheckbox.checked = false;
      }
    });
  });
}

/** 전체 비우기 함수  */
export function removeAllHandler(state) {
  const clearBtn = document.getElementById("cart-modal-clear-cart-btn");
  if (!clearBtn) return;

  clearBtn.addEventListener("click", () => {
    cart.state = [];
    CartModal(state);
    updateCartCount();
  });
}

// 장바구니 추가 알림 토스트
export function showAddToCartToast() {
  const old = document.getElementById("toast-message");
  if (old) old.remove();

  const toast = document.createElement("div");
  toast.id = "toast-message";
  toast.className = "fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50";

  toast.innerHTML = `
    <div class="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
      <div class="flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <p class="text-sm font-medium">장바구니에 추가되었습니다</p>
      <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(toast);

  toast.querySelector("#toast-close-btn").addEventListener("click", () => {
    toast.remove();
  });

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
