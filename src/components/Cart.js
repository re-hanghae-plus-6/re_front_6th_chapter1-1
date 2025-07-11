import { cartStore } from "../store/store.js";
import toast from "./Toast.js";

class Cart {
  constructor() {
    this.el = null;

    // 스토어 상태 변화 감지
    cartStore.subscribe((storeState) => {
      const prevIsOpen = this.state?.isOpen || false;
      const currentIsOpen = storeState.isOpen || false;

      this.state = { ...storeState };

      if (currentIsOpen && !prevIsOpen) {
        // 모달 열기
        this.hide();
        this.render();
        const root = document.getElementById("root");
        if (root) {
          root.appendChild(this.el);
        } else {
          document.body.appendChild(this.el);
        }
        this.show();
      } else if (!currentIsOpen && prevIsOpen) {
        // 모달 닫기
        if (this.el) {
          if (this.el.parentNode) {
            this.el.parentNode.removeChild(this.el);
          }
          this.el.style.display = "none";
          this.el = null;
        }
      } else if (currentIsOpen && prevIsOpen && this.el) {
        // 내용만 업데이트
        this.update();
      }
    });
  }

  // 장바구니 내용 업데이트
  update() {
    if (!this.el) {
      return;
    }

    // 헤더에 아이템 개수 표시
    const headerTitle = this.el.querySelector("h2");
    if (headerTitle) {
      const items = this.state?.items || [];
      const itemCount = items.length;

      const itemCountText =
        itemCount > 0 ? `<span class="text-sm font-normal text-gray-600 ml-1">(${itemCount})</span>` : "";

      headerTitle.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
        </svg>
        장바구니
        ${itemCountText}
      `;
    }

    // 내용 새로고침
    const contentContainer = this.el.querySelector(".cart-content");
    if (contentContainer) {
      contentContainer.innerHTML = this.templateContent();
      this.bindEventListeners();
    }
  }

  // 모달 보이기
  show() {
    if (this.el) {
      this.el.style.display = "block";
    } else {
      this.render();
      const root = document.getElementById("root");
      if (root) {
        root.appendChild(this.el);
      }
      this.el.style.display = "block";
    }
  }

  // 모달 숨기기
  hide() {
    if (this.el) {
      if (this.el.parentNode) {
        this.el.parentNode.removeChild(this.el);
      }
      this.el.style.display = "none";
      this.el = null;
    }
    const existingOverlay = document.querySelector(".cart-modal-overlay");
    if (existingOverlay && existingOverlay.parentNode) {
      existingOverlay.parentNode.removeChild(existingOverlay);
    }
    this.removeEventListeners();
  }

  // 이벤트 리스너 정리
  removeEventListeners() {
    if (this.keydownHandler) {
      document.removeEventListener("keydown", this.keydownHandler);
      this.keydownHandler = null;
    }
  }

  // 장바구니 아이템
  templateCartItem(item) {
    return `
      <div class="flex items-center py-3 border-b border-gray-100 cart-item" data-product-id="${item.id}">
        <!-- 선택 체크박스 -->
        <label class="flex items-center mr-3">
          <input type="checkbox" class="cart-item-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" data-product-id="${item.id}" ${item.isSelected ? "checked" : ""}>
        </label>
        <!-- 상품 이미지 -->
        <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
          <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover cursor-pointer cart-item-image" data-product-id="${item.id}">
        </div>
        <!-- 상품 정보 -->
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium text-gray-900 truncate cursor-pointer cart-item-title" data-product-id="${item.id}">${item.title}</h4>
          <p class="text-sm text-gray-600 mt-1">${item.price.toLocaleString()}원</p>
          <!-- 수량 조절 -->
          <div class="flex items-center mt-2">
            <button class="quantity-decrease-btn w-7 h-7 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100" data-product-id="${item.id}">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
            </button>
            <input type="number" value="${item.quantity}" min="1" class="quantity-input w-12 h-7 text-center text-sm border-t border-b border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" disabled data-product-id="${item.id}">
            <button class="quantity-increase-btn w-7 h-7 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100" data-product-id="${item.id}">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
          </div>
        </div>
        <!-- 가격 및 삭제 -->
        <div class="text-right ml-3">
          <p class="text-sm font-medium text-gray-900">${(item.price * item.quantity).toLocaleString()}원</p>
          <button class="cart-item-remove-btn mt-1 text-xs text-red-600 hover:text-red-800" data-product-id="${item.id}">삭제</button>
        </div>
      </div>
    `;
  }

  // 장바구니 비어있을 때
  templateEmpty() {
    return `
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
    `;
  }

  // 장바구니 메인
  templateContent() {
    const items = this.state?.items || [];

    if (items.length === 0) {
      return this.templateEmpty();
    }

    // 금액 계산
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const selectedItems = items.filter((item) => item.isSelected);
    const selectedItemCount = selectedItems.length;
    const selectedTotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const allItemsSelected = items.length > 0 && selectedItemCount === items.length;

    return `
      <div class="flex flex-col max-h-[calc(90vh-120px)]">
        <!-- 전체 선택 섹션 -->
        <div class="p-4 border-b border-gray-200 bg-gray-50">
          <label class="flex items-center text-sm text-gray-700">
            <input type="checkbox" id="cart-modal-select-all-checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2" ${allItemsSelected ? "checked" : ""}>
            전체선택 (${items.length}개)
          </label>
        </div>
        <!-- 아이템 목록 -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-4 space-y-4">
            ${items.map(this.templateCartItem).join("")}
          </div>
        </div>
      </div>
      <!-- 하단 액션 -->
      <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        ${
          selectedItemCount > 0
            ? `
          <!-- 선택된 아이템 정보 -->
          <div class="flex justify-between items-center mb-3 text-sm">
            <span class="text-gray-600">선택한 상품 (${selectedItemCount}개)</span>
            <span class="font-medium">${selectedTotal.toLocaleString()}원</span>
          </div>
        `
            : ""
        }
        <!-- 총 금액 -->
        <div class="flex justify-between items-center mb-4">
          <span class="text-lg font-bold text-gray-900">총 금액</span>
          <span class="text-xl font-bold text-blue-600">${total.toLocaleString()}원</span>
        </div>
        <!-- 액션 버튼들 -->
        <div class="space-y-2">
          ${
            selectedItemCount > 0
              ? `
            <button id="cart-modal-remove-selected-btn" class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm">
              선택한 상품 삭제 (${selectedItemCount}개)
            </button>
          `
              : ""
          }
          <div class="flex gap-2">
            <button id="cart-modal-clear-cart-btn" class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm">전체 비우기</button>
            <button id="cart-modal-checkout-btn" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm">구매하기</button>
          </div>
        </div>
      </div>
    `;
  }
  // 헤더 아이템 개수
  itemCountText() {
    const items = this.state?.items || [];
    const itemCount = items.length;
    return itemCount > 0 ? `<span class="text-sm font-normal text-gray-600 ml-1">(${itemCount})</span>` : "";
  }

  // 장바구니 모달 전체
  templateShell() {
    return `
      <div class="fixed inset-0 z-50 overflow-y-auto cart-modal" style="display: none;">
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
                ${this.itemCountText()}
              </h2>
              <button id="cart-modal-close-btn" class="text-gray-400 hover:text-gray-600 p-1">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <!-- 컨텐츠 -->
            <div class="flex flex-col cart-content max-h-[calc(90vh-120px)]">
              ${this.templateContent()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 이벤트 리스너 등록
  bindEventListeners() {
    this.removeEventListeners();

    // 모달 닫기
    this.el.querySelector("#cart-modal-close-btn")?.addEventListener("click", () => cartStore.close());
    this.el.querySelector(".cart-modal-overlay")?.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) {
        cartStore.close();
      }
    });

    // ESC 키
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        cartStore.close();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    this.keydownHandler = handleKeyDown;

    // 삭제 버튼
    this.el.querySelectorAll(".cart-item-remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = e.currentTarget.dataset.productId;
        cartStore.removeItem(productId);
      });
    });

    // 수량 조절
    this.el.querySelectorAll(".quantity-increase-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = e.currentTarget.dataset.productId;
        cartStore.increaseQuantity(productId);
      });
    });

    this.el.querySelectorAll(".quantity-decrease-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = e.currentTarget.dataset.productId;
        cartStore.decreaseQuantity(productId);
      });
    });

    // 체크박스
    this.el.querySelectorAll(".cart-item-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const productId = e.currentTarget.dataset.productId;
        cartStore.toggleItemSelection(productId);
      });
    });

    // 전체 선택
    this.el.querySelector("#cart-modal-select-all-checkbox")?.addEventListener("change", (e) => {
      cartStore.toggleAllSelection(e.currentTarget.checked);
    });

    // 선택 삭제
    this.el.querySelector("#cart-modal-remove-selected-btn")?.addEventListener("click", () => {
      cartStore.removeSelectedItems();
      toast.showInfo("선택된 상품들이 삭제되었습니다");
    });

    // 전체 비우기
    this.el.querySelector("#cart-modal-clear-cart-btn")?.addEventListener("click", () => {
      cartStore.clearCart();
      toast.showInfo("장바구니가 비워졌습니다");
    });
  }

  // DOM 생성
  render() {
    const template = document.createElement("template");
    template.innerHTML = this.templateShell().trim();
    this.el = template.content.firstElementChild;
    this.bindEventListeners();
    return this.el;
  }
}

export default Cart;
