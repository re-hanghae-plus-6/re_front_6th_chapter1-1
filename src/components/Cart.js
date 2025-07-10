import { cartStore } from "../store/store.js";

class Cart {
  constructor() {
    this.el = null;
    this.state = {
      items: [],
      total: 0,
      isOpen: false,
    };

    cartStore.subscribe((storeState) => {
      this.setState(storeState);
    });
  }

  setState(nextState) {
    const prevStateIsOpen = this.state.isOpen;
    this.state = { ...this.state, ...nextState };
    const currentIs = this.state.isOpen;

    if (currentIs && !prevStateIsOpen) {
      // Cart is opening
      if (this.el) {
        this.el.remove();
        this.el = null;
      }
      this.render();
      document.body.appendChild(this.el);
      this.show();
    } else if (!currentIs && prevStateIsOpen) {
      this.hide();
    } else if (currentIs && prevStateIsOpen) {
      this.update();
    }
  }

  update() {
    if (!this.el) return;

    const contentContainer = this.el.querySelector(".cart-content");
    if (contentContainer) {
      contentContainer.innerHTML = this.templateContent();
    }
    this.addEvent();
  }

  show() {
    this.el?.classList.remove("hidden");
    this.el?.classList.add("flex");
  }

  hide() {
    this.el?.classList.remove("flex");
    this.el?.classList.add("hidden");
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
    this.el = null;
  }

  // 장바구니 아이템 템플릿
  templateCartItem(item) {
    return `
      <div class="flex items-center py-3 border-b border-gray-100 cart-item" data-product-id="${item.id}">
        <input type="checkbox" class="cart-item-checkbox mr-3" data-product-id="${item.id}" ${item.isSelected ? "checked" : ""}>
        <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
          <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium text-gray-900 truncate">${item.title}</h4>
          <p class="text-sm text-gray-600 mt-1">${item.price.toLocaleString()}원</p>
          <div class="flex items-center mt-2">
            <button class="quantity-decrease-btn w-7 h-7 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100" data-product-id="${item.id}">-</button>
            <input type="number" value="${item.quantity}" min="1" class="quantity-input w-12 h-7 text-center text-sm border-t border-b border-gray-300" readonly>
            <button class="quantity-increase-btn w-7 h-7 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100" data-product-id="${item.id}">+</button>
          </div>
        </div>
        <div class="text-right ml-3">
          <p class="text-sm font-medium text-gray-900">${(item.price * item.quantity).toLocaleString()}원</p>
          <button class="cart-item-remove-btn mt-1 text-xs text-red-600 hover:text-red-800" data-product-id="${item.id}">삭제</button>
        </div>
      </div>
    `;
  }

  // 장바구니 비어있을 때 템플릿
  templateEmpty() {
    return `
      <div class="flex-1 flex items-center justify-center p-8">
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900 mb-2">장바구니가 비어있습니다</h3>
          <p class="text-gray-600">원하는 상품을 담아보세요!</p>
        </div>
      </div>
    `;
  }

  // 장바구니 콘텐츠 부분 템플릿
  templateContent() {
    if (this.state.items.length === 0) {
      return this.templateEmpty();
    }

    const total = this.state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const selectedItemCount = this.state.items.filter((item) => item.isSelected).length;
    const allItemsSelected = this.state.items.length > 0 && selectedItemCount === this.state.items.length;

    return `
      <div class="flex-1 overflow-y-auto">
        <div class="p-4 space-y-4">
          ${this.state.items.map(this.templateCartItem).join("")}
        </div>
      </div>
      <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center">
            <input type="checkbox" id="cart-modal-select-all-checkbox" class="mr-2" ${allItemsSelected ? "checked" : ""}>
            <label for="cart-modal-select-all-checkbox" class="text-sm text-gray-700">전체선택 (${selectedItemCount}개)</label>
          </div>
          <div class="flex gap-2">
            <button id="cart-modal-remove-selected-btn" class="text-sm text-red-600 hover:text-red-800">선택 삭제</button>
            <button id="cart-modal-clear-cart-btn" class="text-sm text-red-600 hover:text-red-800">전체 비우기</button>
          </div>
        </div>
        <div class="flex justify-between items-center mb-4">
          <span class="text-lg font-bold text-gray-900">총 금액</span>
          <span class="text-xl font-bold text-blue-600">${total.toLocaleString()}원</span>
        </div>
        <button id="cart-modal-checkout-btn" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm">구매하기</button>
      </div>
    `;
  }

  // 전체 모달의 기본 틀
  templateShell() {
    return `
      <div class="cart-modal-overlay fixed inset-0 z-50 hidden min-h-full items-center justify-center bg-gray-900 bg-opacity-50 transition-opacity sm:items-start sm:p-4">
        <div class="flex w-full min-h-full items-center justify-center p-0 sm:items-center sm:p-4">
          <div class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
            <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900">장바구니</h2>
              <button id="cart-modal-close-btn" class="text-gray-400 hover:text-gray-600 p-1">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div class="flex flex-col cart-content max-h-[calc(90vh-120px)]">
              ${this.templateContent()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  addEvent() {
    this.el.querySelector("#cart-modal-close-btn")?.addEventListener("click", () => cartStore.close());
    this.el.querySelector(".cart-modal-overlay")?.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) {
        cartStore.close();
      }
    });

    this.el.querySelectorAll(".cart-item-remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = e.currentTarget.dataset.productId;
        cartStore.removeItem(productId);
      });
    });

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

    // 새로 추가된 이벤트 리스너
    this.el.querySelectorAll(".cart-item-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const productId = e.currentTarget.dataset.productId;
        cartStore.toggleItemSelection(productId);
      });
    });

    this.el.querySelector("#cart-modal-select-all-checkbox")?.addEventListener("change", (e) => {
      cartStore.toggleAllSelection(e.currentTarget.checked);
    });

    this.el.querySelector("#cart-modal-remove-selected-btn")?.addEventListener("click", () => {
      cartStore.removeSelectedItems();
    });

    this.el.querySelector("#cart-modal-clear-cart-btn")?.addEventListener("click", () => {
      cartStore.clearCart();
    });
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = this.templateShell().trim();
    this.el = template.content.firstElementChild;
    this.addEvent();
    return this.el; // 이 줄을 제거합니다.
  }
}

export default Cart;
