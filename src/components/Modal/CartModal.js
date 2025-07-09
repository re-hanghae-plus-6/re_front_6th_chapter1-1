import { CartEmptyItem } from "../CartProductSection/CartEmptyItem";
import { CartProductSection } from "../CartProductSection/CartProductSection";

export const CartModal = ({ count = 0 }) => {
  const selectedCount = 0;

  const renderCartProduct = () => {
    if (count === 0) {
      return CartEmptyItem();
    }

    return /* HTML */ `
      <div class="flex flex-col max-h-[calc(90vh-120px)]">
        <!-- 전체 선택 섹션 -->
        <div class="p-4 border-b border-gray-200 bg-gray-50">
          <label class="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              id="cart-modal-select-all-checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
            />
            전체선택 (2개)
          </label>
        </div>

        <!-- 아이템 목록 -->
        ${CartProductSection()}
      </div>
    `;
  };

  const renderFooter = () => {
    if (count === 0) {
      return "";
    }

    return /* HTML */ ` <!-- 하단 액션 -->
      <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        ${selectedCount > 0
          ? /* HTML */ `<!-- 선택된 아이템 정보 -->
              <div class="flex justify-between items-center mb-3 text-sm">
                <span class="text-gray-600">선택한 상품 (1개)</span>
                <span class="font-medium">440원</span>
              </div>`
          : ""}

        <!-- 총 금액 -->
        <div class="flex justify-between items-center mb-4">
          <span class="text-lg font-bold text-gray-900">총 금액</span>
          <span class="text-xl font-bold text-blue-600">670원</span>
        </div>
        <!-- 액션 버튼들 -->
        <div class="space-y-2">
          ${selectedCount > 0
            ? /* HTML */ `<button
                id="cart-modal-remove-selected-btn"
                class="w-full bg-red-600 text-white py-2 px-4 rounded-md
          hover:bg-red-700 transition-colors text-sm"
              >
                선택한 상품 삭제 (1개)
              </button>`
            : ""}

          <div class="flex gap-2">
            <button
              id="cart-modal-clear-cart-btn"
              class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md
                       hover:bg-gray-700 transition-colors text-sm"
            >
              전체 비우기
            </button>
            <button
              id="cart-modal-checkout-btn"
              class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md
                       hover:bg-blue-700 transition-colors text-sm"
            >
              구매하기
            </button>
          </div>
        </div>
      </div>`;
  };

  return /* HTML */ `
    <div class="fixed inset-0 z-50 overflow-y-auto cart-modal">
      <!-- 배경 오버레이 -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity cart-modal-overlay"></div>
      <!-- 모달 컨테이너 -->
      <div class="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
        <div
          class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden"
        >
          <!-- 헤더 -->
          <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
                ></path>
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
          ${renderCartProduct()} ${renderFooter()}
        </div>
      </div>
    </div>
  `;
};

function showCartModal() {
  const header = document.querySelector("header");
  if (header) {
    header.insertAdjacentHTML("afterend", CartModal({ count: 0 }));
  }

  function hideCartModal() {
    const modal = document.querySelector(".cart-modal");
    if (modal) {
      modal.remove();
    }
  }

  const closeBtn = document.querySelector("#cart-modal-close-btn");
  const overlay = document.querySelector(".cart-modal-overlay");

  if (closeBtn && overlay) {
    closeBtn.addEventListener("click", hideCartModal);
    overlay.addEventListener("click", hideCartModal);
  }
}

export function addHeaderEvents() {
  document.addEventListener("click", (e) => {
    const isCartBtn = e.target.closest("#cart-icon-btn");
    if (isCartBtn) {
      showCartModal();
    }
  });
}
