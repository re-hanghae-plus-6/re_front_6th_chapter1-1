import { cart, saveCart, updateCartBadge } from "./cart.state.js";

const format = (won) => `${Number(won).toLocaleString()}원`;

export function openCartModal() {
  if (document.querySelector(".cart-modal-overlay")) return;

  const overlay = document.createElement("div");
  overlay.className =
    "cart-modal-overlay fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4";
  document.body.appendChild(overlay);

  const escHandler = (e) => {
    if (e.key === "Escape") closeCartModal();
  };
  document.addEventListener("keydown", escHandler);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeCartModal();
  });

  renderCartModal();

  function closeCartModal() {
    overlay.remove();
    document.removeEventListener("keydown", escHandler);
  }

  function renderCartModal() {
    overlay.innerHTML = "";

    const cartItems = Object.values(cart);
    if (cartItems.length === 0) {
      overlay.innerHTML = `
          <div class="cart-modal relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
            <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                </svg>
                장바구니
              </h2>
              <button id="cart-modal-close-btn" class="text-gray-400 hover:text-gray-600 p-1">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div class="flex-1 flex items-center justify-center p-8">
              <div class="text-center">
                <div class="text-gray-400 mb-4">
                  <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">장바구니가 비어있습니다</h3>
                <p class="text-gray-600">원하는 상품을 담아보세요!</p>
              </div>
            </div>
          </div>`;
      overlay.querySelector("#cart-modal-close-btn").onclick = closeCartModal;
      return;
    }

    const totalCount = cartItems.length;
    const totalPrice = cartItems.reduce((sum, i) => sum + i.product.lprice * i.quantity, 0);

    const modal = document.createElement("div");
    modal.className =
      "cart-modal relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden";
    overlay.appendChild(modal);

    modal.innerHTML = `
        <!-- 헤더 -->
        <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
            </svg>
            장바구니 <span class="text-sm text-gray-600 ml-1">(${totalCount})</span>
          </h2>
          <button id="cart-modal-close-btn" class="text-gray-400 hover:text-gray-600 p-1">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
  
        <!-- 아이템 목록 -->
        <div class="flex flex-col max-h-[calc(90vh-120px)]">
          <div class="p-4 border-b border-gray-200 bg-gray-50">
            <label class="flex items-center text-sm text-gray-700">
              <input type="checkbox" id="cart-modal-select-all-checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2">
              전체선택 (${totalCount}개)
            </label>
          </div>
          <div class="flex-1 overflow-y-auto">
            <div class="p-4 space-y-4">
              ${cartItems
                .map(
                  ({ product, quantity }) => `
                <div class="flex items-center py-3 border-b border-gray-100 cart-item" data-product-id="${product.productId}">
                  <label class="flex items-center mr-3">
                    <input type="checkbox" class="cart-item-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" data-product-id="${product.productId}">
                  </label>
                  <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                    <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover cursor-pointer cart-item-image">
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-gray-900 truncate">${product.title}</h4>
                    <p class="text-sm text-gray-600 mt-1">${format(product.lprice)}</p>
                    <div class="flex items-center mt-2">
                      <button class="quantity-decrease-btn w-7 h-7 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100" data-product-id="${product.productId}">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
                      </button>
                      <input type="number" class="quantity-input w-12 h-7 text-center text-sm border-t border-b border-gray-300" value="${quantity}" min="1" disabled data-product-id="${product.productId}">
                      <button class="quantity-increase-btn w-7 h-7 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100" data-product-id="${product.productId}">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                      </button>
                    </div>
                  </div>
                  <div class="text-right ml-3">
                    <p class="text-sm font-medium text-gray-900 price-field" data-product-id="${product.productId}">${format(product.lprice * quantity)}</p>
                    <button class="cart-item-remove-btn mt-1 text-xs text-red-600 hover:text-red-800" data-product-id="${product.productId}">삭제</button>
                  </div>
                </div>`,
                )
                .join("")}
            </div>
          </div>
  
          <!-- 하단 -->
          <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4 space-y-2">
            <!-- 선택 요약 (초기 hidden) -->
            <div id="cart-modal-selected-summary" class="flex justify-between items-center text-sm hidden">
              <span class="text-gray-600">선택한 상품 (<span id="selected-count">0</span>개)</span>
              <span class="font-medium" id="selected-amount">0원</span>
            </div>
  
            <!-- 총 금액 -->
            <div class="flex justify-between items-center mb-1 text-sm">
              <span class="text-gray-600">총 금액</span>
              <span class="font-bold" id="cart-modal-total-amount">${format(totalPrice)}</span>
            </div>
  
            <!-- 액션 버튼 -->
            <button id="cart-modal-remove-selected-btn"
                    class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm hidden">
              선택한 상품 삭제 (0개)
            </button>
  
            <div class="flex gap-2">
              <button id="cart-modal-clear-cart-btn"
                      class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm">
                전체 비우기
              </button>
              <button id="cart-modal-checkout-btn"
                      class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm">
                구매하기
              </button>
            </div>
          </div>
        </div>`;

    modal.querySelector("#cart-modal-close-btn").onclick = closeCartModal;
    modal.querySelectorAll(".quantity-increase-btn").forEach((btn) => {
      btn.onclick = () => {
        const pid = btn.dataset.productId;
        cart[pid].quantity += 1;
        saveCart();
        const qtyInput = modal.querySelector(`.quantity-input[data-product-id="${pid}"]`);
        const priceField = modal.querySelector(`.price-field[data-product-id="${pid}"]`);
        qtyInput.value = cart[pid].quantity;
        priceField.textContent = format(cart[pid].quantity * cart[pid].product.lprice);
        modal.querySelector("#cart-modal-total-amount").textContent = format(
          Object.values(cart).reduce((s, c) => s + c.product.lprice * c.quantity, 0),
        );
      };
    });
    modal.querySelectorAll(".quantity-decrease-btn").forEach((btn) => {
      btn.onclick = () => {
        const pid = btn.dataset.productId;
        if (cart[pid].quantity === 1) return;
        cart[pid].quantity -= 1;
        saveCart();
        const qtyInput = modal.querySelector(`.quantity-input[data-product-id="${pid}"]`);
        const priceField = modal.querySelector(`.price-field[data-product-id="${pid}"]`);
        qtyInput.value = cart[pid].quantity;
        priceField.textContent = format(cart[pid].quantity * cart[pid].product.lprice);
        modal.querySelector("#cart-modal-total-amount").textContent = format(
          Object.values(cart).reduce((s, c) => s + c.product.lprice * c.quantity, 0),
        );
      };
    });
    modal.querySelectorAll(".cart-item-remove-btn").forEach((btn) => {
      btn.onclick = () => {
        const pid = btn.dataset.productId;
        delete cart[pid];
        saveCart();
        updateCartBadge();
        renderCartModal();
      };
    });

    const selectAllChk = modal.querySelector("#cart-modal-select-all-checkbox");
    const itemChks = modal.querySelectorAll(".cart-item-checkbox");
    const removeSelBtn = modal.querySelector("#cart-modal-remove-selected-btn");

    const recalcSelection = () => {
      const selectedCnt = [...itemChks].filter((c) => c.checked).length;

      selectAllChk.checked = selectedCnt === itemChks.length;
      selectAllChk.indeterminate = selectedCnt > 0 && selectedCnt < itemChks.length;

      // 선택 요약 + 버튼 노출 제어
      const selSummary = modal.querySelector("#cart-modal-selected-summary");
      const selAmount = modal.querySelector("#selected-amount");
      const selBtn = modal.querySelector("#cart-modal-remove-selected-btn");

      if (selectedCnt === 0) {
        selSummary.classList.add("hidden");
        selBtn.classList.add("hidden");
      } else {
        const sum = [...itemChks]
          .filter((c) => c.checked)
          .reduce((s, c) => {
            const pid = c.dataset.productId;
            return s + cart[pid].product.lprice * cart[pid].quantity;
          }, 0);

        selSummary.classList.remove("hidden");
        selBtn.classList.remove("hidden");
        selSummary.querySelector("#selected-count").textContent = selectedCnt;
        selAmount.textContent = format(sum);
        selBtn.textContent = `선택한 상품 삭제 (${selectedCnt}개)`;
      }
    };

    selectAllChk.onchange = () => {
      itemChks.forEach((c) => (c.checked = selectAllChk.checked));
      recalcSelection();
    };
    itemChks.forEach((c) => (c.onchange = recalcSelection));
    recalcSelection();

    removeSelBtn.onclick = () => {
      const selectedPids = [...itemChks].filter((c) => c.checked).map((c) => c.dataset.productId);

      selectedPids.forEach((pid) => delete cart[pid]);
      saveCart();
      updateCartBadge();
      renderCartModal(); // 모달 전체 재렌더 → UI 동기화
    };

    modal.querySelector("#cart-modal-clear-cart-btn").onclick = () => {
      Object.keys(cart).forEach((pid) => delete cart[pid]);
      saveCart();
      updateCartBadge();
      renderCartModal();
    };
  }
}
