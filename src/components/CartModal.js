import { formatPrice } from "../utils/formatters.js";
import { cartStore } from "../stores/CartStore.js";
import { productStore } from "../stores/ProductStore.js";

/**
 * 장바구니 모달 렌더링 및 이벤트 처리
 */

// 장바구니 모달 템플릿 생성
function createCartModalTemplate(cartItems, products) {
  const itemCount = Object.keys(cartItems).length;

  if (itemCount === 0) {
    return `
      <div class="fixed inset-0 z-50 overflow-y-auto cart-modal">
        <!-- 배경 오버레이 -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity cart-modal-overlay"></div>
        <!-- 모달 컨테이너 -->
        <div class="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
          <div class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
            <!-- 헤더 -->
            <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                </svg>
                장바구니 
              </h2>
              
              <button id="cart-modal-close-btn" class="text-gray-400 hover:text-gray-600 p-1">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <!-- 컨텐츠 -->
            <div class="flex flex-col max-h-[calc(90vh-120px)]">
              <!-- 빈 장바구니 -->
              <div class="flex-1 flex items-center justify-center p-8">
                <div class="text-center">
                  <div class="text-gray-400 mb-4">
                    <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">장바구니가 비어있습니다</h3>
                  <p class="text-gray-600">원하는 상품을 담아보세요!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 장바구니 아이템들 렌더링
  const cartItemsHtml = Object.entries(cartItems)
    .map(([productId, quantity]) => {
      const product = products.find((p) => p.productId === productId);
      if (!product) return "";

      const totalPrice = product.lprice * quantity;

      return `
      <div class="flex items-center py-3 border-b border-gray-100 cart-item" data-product-id="${productId}">
        <!-- 선택 체크박스 -->
        <label class="flex items-center mr-3">
          <input type="checkbox" class="cart-item-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded 
            focus:ring-blue-500" data-product-id="${productId}">
        </label>
        <!-- 상품 이미지 -->
        <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
          <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover cursor-pointer cart-item-image" data-product-id="${productId}">
        </div>
        <!-- 상품 정보 -->
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium text-gray-900 truncate cursor-pointer cart-item-title" data-product-id="${productId}">
            ${product.title}
          </h4>
          <p class="text-sm text-gray-600 mt-1">
            ${formatPrice(product.lprice)}원
          </p>
          <!-- 수량 조절 -->
          <div class="flex items-center mt-2">
            <button class="quantity-decrease-btn w-7 h-7 flex items-center justify-center 
             border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100" data-product-id="${productId}">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
            </button>
            <input type="number" value="${quantity}" min="1" class="quantity-input w-12 h-7 text-center text-sm border-t border-b 
            border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" disabled="" data-product-id="${productId}">
            <button class="quantity-increase-btn w-7 h-7 flex items-center justify-center 
             border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100" data-product-id="${productId}">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
          </div>
        </div>
        <!-- 가격 및 삭제 -->
        <div class="text-right ml-3">
          <p class="text-sm font-medium text-gray-900">
            ${formatPrice(totalPrice)}원
          </p>
          <button class="cart-item-remove-btn mt-1 text-xs text-red-600 hover:text-red-800" data-product-id="${productId}">
            삭제
          </button>
        </div>
      </div>
    `;
    })
    .join("");

  // 총 금액 계산
  const totalAmount = Object.entries(cartItems).reduce((sum, [productId, quantity]) => {
    const product = products.find((p) => p.productId === productId);
    return sum + (product ? product.lprice * quantity : 0);
  }, 0);

  // 선택된 아이템들의 금액 계산 (체크박스 상태에 따라 동적으로 업데이트됨)
  //   const selectedAmount = totalAmount; // 초기값으로 전체 금액 사용

  return `
    <div class="fixed inset-0 z-50 overflow-y-auto cart-modal">
      <!-- 배경 오버레이 -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity cart-modal-overlay"></div>
      <!-- 모달 컨테이너 -->
      <div class="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
        <div class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
          <!-- 헤더 -->
          <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
              </svg>
              장바구니
              <span class="text-sm font-normal text-gray-600 ml-1">(${itemCount})</span>
            </h2>
            <button id="cart-modal-close-btn" class="text-gray-400 hover:text-gray-600 p-1">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <!-- 컨텐츠 -->
          <div class="flex flex-col max-h-[calc(90vh-120px)]">
            <!-- 전체 선택 섹션 -->
            <div class="p-4 border-b border-gray-200 bg-gray-50">
              <label class="flex items-center text-sm text-gray-700">
                <input type="checkbox" id="cart-modal-select-all-checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2">
                전체선택 (${itemCount}개)
              </label>
            </div>
            <!-- 아이템 목록 -->
            <div class="flex-1 overflow-y-auto">
              <div class="p-4 space-y-4">
                ${cartItemsHtml}
              </div>
            </div>
          </div>
          <!-- 하단 액션 -->
          <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <!-- 선택된 아이템 정보 -->
            <div class="flex justify-between items-center mb-3 text-sm cart-selected-info" style="display: none;">
              <span class="text-gray-600">선택한 상품 (<span class="selected-count">0</span>개)</span>
              <span class="font-medium selected-amount">${formatPrice(0)}원</span>
            </div>
            <!-- 총 금액 -->
            <div class="flex justify-between items-center mb-4">
              <span class="text-lg font-bold text-gray-900">총 금액</span>
              <span class="text-xl font-bold text-blue-600 total-amount">${formatPrice(totalAmount)}원</span>
            </div>
            <!-- 액션 버튼들 -->
            <div class="space-y-2">
              <button id="cart-modal-remove-selected-btn" class="w-full bg-red-600 text-white py-2 px-4 rounded-md 
                         hover:bg-red-700 transition-colors text-sm" style="display: none;">
                선택한 상품 삭제 (<span class="selected-count">0</span>개)
              </button>
              <div class="flex gap-2">
                <button id="cart-modal-clear-cart-btn" class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md 
                         hover:bg-gray-700 transition-colors text-sm">
                  전체 비우기
                </button>
                <button id="cart-modal-checkout-btn" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md 
                         hover:bg-blue-700 transition-colors text-sm">
                  구매하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 장바구니 모달 이벤트 바인딩
function bindCartModalEvents() {
  // 모달 닫기 이벤트
  const closeBtn = document.getElementById("cart-modal-close-btn");
  const overlay = document.querySelector(".cart-modal-overlay");

  if (closeBtn) {
    closeBtn.addEventListener("click", hideCartModal);
  }

  if (overlay) {
    overlay.addEventListener("click", hideCartModal);
  }

  // ESC 키로 모달 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.querySelector(".cart-modal")) {
      hideCartModal();
    }
  });

  // 수량 조절 이벤트
  document.querySelectorAll(".quantity-increase-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.getAttribute("data-product-id");
      const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
      const currentValue = parseInt(input.value);
      cartStore.updateQuantity(productId, currentValue + 1);
    });
  });

  document.querySelectorAll(".quantity-decrease-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.getAttribute("data-product-id");
      const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
      const currentValue = parseInt(input.value);
      if (currentValue > 1) {
        cartStore.updateQuantity(productId, currentValue - 1);
      }
    });
  });

  // 상품 삭제 이벤트
  document.querySelectorAll(".cart-item-remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.getAttribute("data-product-id");
      cartStore.removeItem(productId);
    });
  });

  // 전체 선택/해제 이벤트
  const selectAllCheckbox = document.getElementById("cart-modal-select-all-checkbox");
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", () => {
      const isChecked = selectAllCheckbox.checked;
      document.querySelectorAll(".cart-item-checkbox").forEach((checkbox) => {
        checkbox.checked = isChecked;
      });
      updateSelectedInfo();
    });
  }

  // 개별 체크박스 이벤트
  document.querySelectorAll(".cart-item-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", updateSelectedInfo);
  });

  // 선택 삭제 이벤트
  const removeSelectedBtn = document.getElementById("cart-modal-remove-selected-btn");
  if (removeSelectedBtn) {
    removeSelectedBtn.addEventListener("click", () => {
      const selectedCheckboxes = document.querySelectorAll(".cart-item-checkbox:checked");
      selectedCheckboxes.forEach((checkbox) => {
        const productId = checkbox.getAttribute("data-product-id");
        cartStore.removeItem(productId);
      });
    });
  }

  // 전체 비우기 이벤트
  const clearCartBtn = document.getElementById("cart-modal-clear-cart-btn");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      cartStore.clearCart();
    });
  }

  // 상품 상세 페이지 이동 이벤트
  document.querySelectorAll(".cart-item-image, .cart-item-title").forEach((element) => {
    element.addEventListener("click", () => {
      const productId = element.getAttribute("data-product-id");
      hideCartModal();
      window.history.pushState({}, "", `/product/${productId}`);
      window.dispatchEvent(new Event("popstate"));
    });
  });
}

// 선택된 상품 정보 업데이트
function updateSelectedInfo() {
  // 장바구니가 비어있거나 모달이 없으면 종료
  const modal = document.querySelector(".cart-modal");
  if (!modal) return;

  const cartItems = cartStore.getCartItems();
  if (Object.keys(cartItems).length === 0) return;

  const selectedCheckboxes = document.querySelectorAll(".cart-item-checkbox:checked");
  const selectedCount = selectedCheckboxes.length;

  // 선택된 상품들의 총 금액 계산
  let selectedAmount = 0;
  const products = productStore.getState().products;

  selectedCheckboxes.forEach((checkbox) => {
    const productId = checkbox.getAttribute("data-product-id");
    const quantity = cartItems[productId] || 0;
    const product = products.find((p) => p.productId === productId);
    if (product) {
      selectedAmount += product.lprice * quantity;
    }
  });

  // UI 업데이트
  const selectedInfo = document.querySelector(".cart-selected-info");
  const removeSelectedBtn = document.getElementById("cart-modal-remove-selected-btn");

  if (selectedCount > 0) {
    if (selectedInfo) selectedInfo.style.display = "flex";
    if (removeSelectedBtn) removeSelectedBtn.style.display = "block";

    document.querySelectorAll(".selected-count").forEach((el) => {
      el.textContent = selectedCount;
    });

    const selectedAmountEl = document.querySelector(".selected-amount");
    if (selectedAmountEl) {
      selectedAmountEl.textContent = `${formatPrice(selectedAmount)}원`;
    }
  } else {
    if (selectedInfo) selectedInfo.style.display = "none";
    if (removeSelectedBtn) removeSelectedBtn.style.display = "none";
  }

  // 전체 선택 체크박스 상태 업데이트
  const allCheckboxes = document.querySelectorAll(".cart-item-checkbox");
  const selectAllCheckbox = document.getElementById("cart-modal-select-all-checkbox");
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = allCheckboxes.length > 0 && selectedCount === allCheckboxes.length;
  }
}

// 장바구니 모달 표시
export function showCartModal() {
  const cartItems = cartStore.getCartItems();
  const products = productStore.getState().products;

  const modalHtml = createCartModalTemplate(cartItems, products);

  // 기존 모달 제거
  const existingModal = document.querySelector(".cart-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // 새 모달 추가
  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // 이벤트 바인딩
  bindCartModalEvents();

  // 초기 선택 정보 업데이트 (장바구니에 아이템이 있을 때만)
  if (Object.keys(cartItems).length > 0) {
    updateSelectedInfo();
  }
}

// 장바구니 모달 숨김
export function hideCartModal() {
  const modal = document.querySelector(".cart-modal");
  if (modal) {
    modal.remove();
  }
}

// 장바구니 아이콘 클릭 이벤트 바인딩
export function bindCartIconEvent() {
  const cartIcon = document.getElementById("cart-icon-btn");
  if (cartIcon) {
    // 기존 이벤트 리스너 제거 (중복 방지)
    cartIcon.removeEventListener("click", showCartModal);
    // 새 이벤트 리스너 추가
    cartIcon.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      showCartModal();
    });
  }
}
