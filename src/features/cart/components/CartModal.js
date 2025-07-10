import {
  removeFromCart,
  updateItemQuantity,
  toggleItemSelection,
  toggleAllSelection,
  removeSelectedItems,
  clearCart,
  closeCartModal,
} from "../services/cartService.js";
import { cartStore, CART_STORAGE_KEY } from "../store/cartStore.js";
import { saveToStorage } from "../../../utils/localStorage.js";
import { navigate } from "../../../router.js";
import { addEvent } from "../../../utils/eventManager.js";
import { updateElement } from "../../../utils/domUtils.js";
import { showSuccessToast } from "../../../utils/toastManager.js";

const renderHeader = (totalItems = 0) => `
  <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
    <h2 class="text-lg font-bold text-gray-900 flex items-center">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
      </svg>
      장바구니${totalItems > 0 ? `<span class="text-sm font-normal text-gray-600 ml-1">(${totalItems})</span>` : " "}
    </h2>
    <button id="cart-modal-close-btn" class="text-gray-400 hover:text-gray-600 p-1">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  </div>
`;

const renderCartItem = (item, isSelected) => `
  <div class="flex items-center py-3 border-b border-gray-100 cart-item" data-product-id="${item.id}">
    <!-- 선택 체크박스 -->
    <label class="flex items-center mr-3">
      <input type="checkbox" ${isSelected ? 'checked=""' : ""} class="cart-item-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded 
        focus:ring-blue-500" data-product-id="${item.id}">
    </label>
    <!-- 상품 이미지 -->
    <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
      <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover cursor-pointer cart-item-image" data-product-id="${item.id}">
    </div>
    <!-- 상품 정보 -->
    <div class="flex-1 min-w-0">
      <h4 class="text-sm font-medium text-gray-900 truncate cursor-pointer cart-item-title" data-product-id="${item.id}">
        ${item.name}
      </h4>
      <p class="text-sm text-gray-600 mt-1">
        ${item.price.toLocaleString()}원
      </p>
      <!-- 수량 조절 -->
      <div class="flex items-center mt-2">
        <button class="quantity-decrease-btn w-7 h-7 flex items-center justify-center 
         border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100" data-product-id="${item.id}">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
          </svg>
        </button>
        <input type="number" value="${item.quantity}" min="1" class="quantity-input w-12 h-7 text-center text-sm border-t border-b 
        border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" disabled="" data-product-id="${item.id}">
        <button class="quantity-increase-btn w-7 h-7 flex items-center justify-center 
         border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100" data-product-id="${item.id}">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </button>
      </div>
    </div>
    <!-- 가격 및 삭제 -->
    <div class="text-right ml-3">
      <p class="text-sm font-medium text-gray-900">
        ${(item.price * item.quantity).toLocaleString()}원
      </p>
      <button class="cart-item-remove-btn mt-1 text-xs text-red-600 hover:text-red-800" data-product-id="${item.id}">
        삭제
      </button>
    </div>
  </div>
`;

const renderActionButtons = (selectedCount = 0, totalPrice = 0, selectedTotal = 0) => {
  const showSelectedActions = selectedCount > 0;

  return `
    <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
      <!-- 선택된 아이템 정보 -->
      ${
        showSelectedActions
          ? `
      <div class="flex justify-between items-center mb-3 text-sm">
        <span class="text-gray-600">선택한 상품 (${selectedCount}개)</span>
        <span class="font-medium">${selectedTotal.toLocaleString()}원</span>
      </div>
      `
          : ""
      }
      <!-- 총 금액 -->
      <div class="flex justify-between items-center mb-4">
        <span class="text-lg font-bold text-gray-900">총 금액</span>
        <span class="text-xl font-bold text-blue-600">${totalPrice.toLocaleString()}원</span>
      </div>
      <!-- 액션 버튼들 -->
      <div class="space-y-2">
        ${
          showSelectedActions
            ? `
        <button id="cart-modal-remove-selected-btn" class="w-full bg-red-600 text-white py-2 px-4 rounded-md 
                   hover:bg-red-700 transition-colors text-sm">
          선택한 상품 삭제 (${selectedCount}개)
        </button>
        `
            : ""
        }
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
  `;
};

const renderModalWrapper = (content) => `
  <div class="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
    <div id="cart-modal-content" class="cart-modal relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
      ${content}
    </div>
  </div>
`;

const renderEmptyCartContent = () => `
  ${renderHeader()}
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
`;

const renderCartWithItemsContent = (items, selectedItems) => {
  const totalItems = items.length;
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedCount = selectedItems.length;
  const selectedTotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isAllSelected = totalItems > 0 && selectedCount === totalItems;

  return `
    ${renderHeader(totalItems)}
    <!-- 컨텐츠 -->
    <div class="flex flex-col max-h-[calc(90vh-120px)]">
      <!-- 전체 선택 섹션 -->
      <div class="p-4 border-b border-gray-200 bg-gray-50">
        <label class="flex items-center text-sm text-gray-700">
          <input type="checkbox" id="cart-modal-select-all-checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2" ${isAllSelected ? "checked" : ""}>
          전체선택 (${totalItems}개)
        </label>
      </div>
      <!-- 아이템 목록 -->
      <div class="flex-1 overflow-y-auto">
        <div class="p-4 space-y-4">
          ${items
            .map((item) => {
              const isSelected = selectedItems.some((selected) => selected.id === item.id);
              return renderCartItem(item, isSelected);
            })
            .join("")}
        </div>
      </div>
    </div>
    ${renderActionButtons(selectedCount, totalPrice, selectedTotal)}
  `;
};

export const CartModal = ({ items = [], selectedItems = [] } = {}) => {
  const totalItems = items.length;

  if (totalItems === 0) {
    return renderModalWrapper(renderEmptyCartContent());
  }

  return renderModalWrapper(renderCartWithItemsContent(items, selectedItems));
};

CartModal.onMount = () => {
  const closeBtn = document.getElementById("cart-modal-close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeCartModal);
  }

  const escKeyHandler = (e) => {
    if (e.key === "Escape") {
      closeCartModal();
    }
  };
  document.addEventListener("keydown", escKeyHandler);

  const modalContainer = document.getElementById("cart-modal-container");
  if (modalContainer) {
    modalContainer.addEventListener("click", (e) => {
      const modalContent = e.target.closest("#cart-modal-content");
      if (!modalContent) {
        closeCartModal();
      }
    });
  }

  addEvent("change", "#cart-modal-select-all-checkbox", (e) => {
    toggleAllSelection(e.target.checked);
  });

  addEvent("change", ".cart-item-checkbox", (e) => {
    const productId = e.target.dataset.productId;
    toggleItemSelection(productId, e.target.checked);
  });

  addEvent("click", ".quantity-increase-btn", (e) => {
    const productId = e.target.closest("button").dataset.productId;
    const quantityInput = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
    const newQuantity = parseInt(quantityInput.value) + 1;
    updateItemQuantity(productId, newQuantity);
  });

  addEvent("click", ".quantity-decrease-btn", (e) => {
    const productId = e.target.closest("button").dataset.productId;
    const quantityInput = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
    const newQuantity = Math.max(1, parseInt(quantityInput.value) - 1);
    updateItemQuantity(productId, newQuantity);
  });

  addEvent("click", ".cart-item-remove-btn", (e) => {
    const productId = e.target.dataset.productId;
    removeFromCart(productId);
    showSuccessToast("상품이 장바구니에서 제거되었습니다.");
  });

  addEvent("click", "#cart-modal-remove-selected-btn", () => {
    removeSelectedItems();
    showSuccessToast("선택한 상품들이 삭제되었습니다.");
  });

  addEvent("click", "#cart-modal-clear-cart-btn", () => {
    if (confirm("장바구니를 모두 비우시겠습니까?")) {
      clearCart();
      showSuccessToast("장바구니가 비워졌습니다.");
    }
  });

  addEvent("click", "#cart-modal-checkout-btn", () => {
    showSuccessToast("구매 기능은 준비중입니다.");
  });

  addEvent("click", ".cart-item-image, .cart-item-title", (e) => {
    const productId = e.target.dataset.productId;
    closeCartModal();
    navigate(`/product/${productId}`);
  });
};

const createModalContainer = () => {
  cleanupModal();

  const modalContainer = document.createElement("div");
  modalContainer.id = "cart-modal-container";
  modalContainer.className = "fixed inset-0 z-50 overflow-y-auto cart-modal-overlay";
  modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.appendChild(modalContainer);
  } else {
    document.body.appendChild(modalContainer);
  }
  return modalContainer;
};

const cleanupModal = () => {
  const existingContainer = document.getElementById("cart-modal-container");
  if (existingContainer) {
    existingContainer.remove();
  }
};

const renderModal = () => {
  const { items, selectedItems, isModalOpen } = cartStore.getState();

  if (isModalOpen) {
    createModalContainer();
    updateElement("#cart-modal-container", CartModal({ items, selectedItems }));
    CartModal.onMount();
  } else {
    cleanupModal();
  }
};

const syncToLocalStorage = (state) => {
  const stateToSave = {
    items: state.items,
    selectedItems: state.selectedItems,
    itemCount: state.itemCount,
  };
  saveToStorage(CART_STORAGE_KEY, stateToSave);
};

export const initCartModal = () => {
  cartStore.subscribe(renderModal);

  cartStore.subscribe(syncToLocalStorage);
};
