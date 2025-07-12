import { Component } from "../../../../componet";
import { cartStore } from "../model/cartStore";
import { getCartAction } from "../controller/get-cart-action";
import { EventDelegator } from "../../../../event-delegator";
import { searchParamsStore } from "../../common/search-params/search-params-store";

export class CartModal extends Component {
  subscribeStoreList: Array<() => void> = [];

  render(): HTMLElement {
    const el = document.createElement("div");

    const visibleCart = searchParamsStore.value?.cart === "true";

    if (!visibleCart) {
      return el;
    }

    el.className = "fixed inset-0 z-50 overflow-y-auto cart-modal cart-modal-overlay";
    el.innerHTML = this.isCartEmpty() ? this.renderEmptyCart() : this.renderCartWithItems();
    return el;
  }

  isCartEmpty(): boolean {
    return cartStore.value.productList.length === 0;
  }

  renderEmptyCart(): string {
    // 장바구니_선택없음.js 스타일 적용
    return `
      <div class="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
        <div class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
          <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
              </svg>
              장바구니
              <span class="text-sm font-normal text-gray-600 ml-1">(0)</span>
            </h2>
            <button event-id="cart-modal-close-btn" class="text-gray-400 hover:text-gray-600 p-1">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="flex flex-col max-h-[calc(90vh-120px)]">
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
          <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <div class="flex justify-between items-center mb-4">
              <span class="text-lg font-bold text-gray-900">총 금액</span>
              <span class="text-xl font-bold text-blue-600">0원</span>
            </div>
            <div class="space-y-2">
              <div class="flex gap-2">
                <button event-id="clear-cart-btn" class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm" disabled>전체 비우기</button>
                <button class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm" disabled>구매하기</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderCartWithItems(): string {
    const actions = getCartAction();
    const productMap = new Map<string, { product: any; quantity: number }>();
    cartStore.value.productList.forEach((p) => {
      if (!productMap.has(p.productId)) productMap.set(p.productId, { product: p, quantity: 1 });
      else productMap.get(p.productId)!.quantity++;
    });
    const items = Array.from(productMap.values());
    const totalCount = cartStore.value.productList.length;
    const selectedCount = cartStore.value.selectedProductIds?.length || 0;
    const totalPrice = this.getTotalPrice();
    const selectedPrice = cartStore.value.productList
      .filter((item) => actions.isSelected(item.productId))
      .reduce((sum, item) => sum + Number(item.lprice || item.hprice), 0);
    return `
      <div class="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
        <div class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
          <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
              </svg>
              장바구니
              <span class="text-sm font-normal text-gray-600 ml-1">(${totalCount})</span>
            </h2>
            <button event-id="cart-modal-close-btn" class="text-gray-400 hover:text-gray-600 p-1">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="flex flex-col max-h-[calc(90vh-120px)]">
            <div class="p-4 border-b border-gray-200 bg-gray-50">
              <label class="flex items-center text-sm text-gray-700">
                <input type="checkbox" event-id="select-all-btn" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2" ${selectedCount === totalCount ? "checked" : ""}>
                전체선택 (${totalCount}개)
              </label>
            </div>
            <div class="flex-1 overflow-y-auto">
              <div class="p-4 space-y-4">
                ${items
                  .map(({ product, quantity }) => {
                    const checked = actions.isSelected(product.productId);
                    return `
                      <div class="flex items-center py-3 border-b border-gray-100 cart-item" data-product-id="${product.productId}">
                        <label class="flex items-center mr-3">
                          <input type="checkbox" class="cart-item-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" data-product-id="${product.productId}" ${checked ? "checked" : ""}>
                        </label>
                        <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                          <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover cursor-pointer cart-item-image" data-product-id="${product.productId}">
                        </div>
                        <div class="flex-1 min-w-0">
                          <h4 class="text-sm font-medium text-gray-900 truncate cursor-pointer cart-item-title" data-product-id="${product.productId}">${product.title}</h4>
                          <p class="text-sm text-gray-600 mt-1">${Number(product.lprice || product.hprice).toLocaleString()}원</p>
                          <div class="flex items-center mt-2">
                            <button event-id="qty-dec" class="quantity-decrease-btn w-7 h-7 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100" data-product-id="${product.productId}">
                              <svg  class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                              </svg>
                            </button>
                            <input type="number" value="${quantity}" min="1" class="quantity-input w-12 h-7 text-center text-sm border-t border-b border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" disabled data-product-id="${product.productId}">
                            <button event-id="qty-inc" class="quantity-increase-btn w-7 h-7 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100" data-product-id="${product.productId}">
                              <svg  class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path  stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div class="text-right ml-3">
                          <p class="text-sm font-medium text-gray-900">${(Number(product.lprice || product.hprice) * quantity).toLocaleString()}원</p>
                          <button event-id="delete-item-btn" class="cart-item-remove-btn mt-1 text-xs text-red-600 hover:text-red-800" data-product-id="${product.productId}">삭제</button>
                        </div>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </div>
          <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <div class="flex justify-between items-center mb-3 text-sm">
              <span class="text-gray-600">선택한 상품 (${selectedCount}개)</span>
              <span class="font-medium">${selectedPrice.toLocaleString()}원</span>
            </div>
            <div class="flex justify-between items-center mb-4">
              <span class="text-lg font-bold text-gray-900">총 금액</span>
              <span class="text-xl font-bold text-blue-600">${totalPrice.toLocaleString()}원</span>
            </div>
            <div class="space-y-2">
              <button event-id="delete-selected-btn" class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm" ${selectedCount === 0 ? "disabled" : ""}>
                선택한 상품 삭제 (${selectedCount}개)
              </button>
              <div class="flex gap-2">
                <button event-id="clear-cart-btn" class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm">전체 비우기</button>
                <button class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm">구매하기</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getTotalPrice(): number {
    return cartStore.value.productList.reduce((sum, item) => sum + Number(item.lprice || item.hprice), 0);
  }

  componentDidMount() {
    searchParamsStore.subscribe(() => {
      this.update();
    });
    this.subscribeStoreList.push(
      cartStore.subscribe(() => {
        this.update();
      }),
    );

    const actions = getCartAction();
    EventDelegator.getInstance().register("click", "cart-modal-close-btn", () => this.closeModal());
    EventDelegator.getInstance().register("click", "qty-inc", (e) => {
      // svg 등 자식이 클릭되어도 버튼을 찾도록
      const button = (e.target as HTMLElement).closest("button[event-id='qty-inc']");
      const productId = button?.getAttribute("data-product-id");
      if (productId) actions.changeQuantity(productId, 1);
    });
    EventDelegator.getInstance().register("click", "qty-dec", (e) => {
      const button = (e.target as HTMLElement).closest("button[event-id='qty-dec']");
      const productId = button?.getAttribute("data-product-id");
      if (productId) actions.changeQuantity(productId, -1);
    });
    EventDelegator.getInstance().register("click", "delete-item-btn", (e) => {
      const productId = (e.target as HTMLElement).getAttribute("data-product-id");
      if (productId) actions.deleteItem(productId);
    });
    EventDelegator.getInstance().register("click", "select-all-btn", () => {
      actions.toggleSelectAll();
    });
    EventDelegator.getInstance().register("click", "delete-selected-btn", () => {
      actions.deleteSelected();
    });
    EventDelegator.getInstance().register("click", "clear-cart-btn", () => {
      actions.clearCart();
    });
    // 체크박스(선택) 이벤트
    this.el.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.classList.contains("cart-item-checkbox")) {
        const productId = target.getAttribute("data-product-id");
        if (productId) actions.toggleSelect(productId, target.checked);
      }
    });
    // 배경 클릭
    this.el.addEventListener("click", (e) => {
      if (e.target === this.el) this.closeModal();
    });
    // ESC 키
    window.addEventListener("keydown", this.handleEsc);
  }

  componentWillUnmount() {
    this.subscribeStoreList.forEach((unsub) => unsub());
    window.removeEventListener("keydown", this.handleEsc);
    EventDelegator.getInstance().unregister("click", "cart-modal-close-btn");
    EventDelegator.getInstance().unregister("click", "qty-inc");
    EventDelegator.getInstance().unregister("click", "qty-dec");
    EventDelegator.getInstance().unregister("click", "delete-item-btn");
    EventDelegator.getInstance().unregister("click", "select-all-btn");
    EventDelegator.getInstance().unregister("click", "delete-selected-btn");
    EventDelegator.getInstance().unregister("click", "clear-cart-btn");
  }

  handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") this.closeModal();
  };

  closeModal() {
    const searchParams = new URLSearchParams(window.location.search);

    searchParams.delete("cart");

    window.history.replaceState({}, "", `${window.location.pathname}?${searchParams.toString()}`);
  }
}
