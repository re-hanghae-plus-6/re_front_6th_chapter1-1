import BaseComponent from "@/core/component";
import {
  getCartItems,
  getCartSummary,
  subscribeToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  selectAllCartItems,
  selectCartItem,
  removeSelectedCartItems,
  isCartItemSelected,
} from "@/store";

export default class CartModal extends BaseComponent {
  constructor(target, props) {
    super(target, props);

    // 구독 해제 함수 저장
    this.unsubscribeCart = null;
  }

  initialState() {
    this.state = {
      items: [],
      summary: {
        itemCount: 0,
        totalQuantity: 0,
        totalPrice: 0,
        isEmpty: true,
        selectedCount: 0,
        selectedTotal: 0,
        isAllSelected: false,
      },
    };
    super.initialState();
  }

  componentDidMount() {
    this.initializeEventHandlers();
    this.initializeCartSubscription();
  }

  componentWillUnmount() {
    // 구독 해제
    if (this.unsubscribeCart) {
      this.unsubscribeCart();
    }

    // 이벤트 리스너 제거
    if (this.eventListenerAttached) {
      this.target.removeEventListener("click", this.handleClick);
      document.removeEventListener("keydown", this.handleKeyDown);
      this.eventListenerAttached = false;
    }
  }

  initializeEventHandlers() {
    if (this.eventListenerAttached) return;
    this.eventListenerAttached = true;

    // 핸들러 고정
    this.handleClick = (event) => {
      const target = event.target;

      // === 모달 닫기 ===
      if (
        target.matches(".cart-modal-overlay") ||
        target.closest('[data-action="close-modal"]') ||
        target.closest("#cart-modal-close-btn")
      ) {
        this.close();
        return;
      }

      // === 수량 증가 ===
      if (target.closest(".quantity-increase-btn")) {
        const productId = target.closest(".quantity-increase-btn").dataset.productId;
        this.handleIncreaseQuantity(productId);
        return;
      }

      // === 수량 감소 ===
      if (target.closest(".quantity-decrease-btn")) {
        const productId = target.closest(".quantity-decrease-btn").dataset.productId;
        this.handleDecreaseQuantity(productId);
        return;
      }

      // === 개별 아이템 삭제 ===
      if (target.matches('[data-action="remove-item"]') || target.matches(".cart-item-remove-btn")) {
        const productId = target.dataset.productId;
        this.handleRemoveItem(productId);
        return;
      }

      // === 장바구니 전체 비우기 ===
      if (target.matches('[data-action="clear-cart"]') || target.closest("#cart-modal-clear-cart-btn")) {
        this.handleClearCart();
        return;
      }

      // === 전체 선택 토글 ===
      if (target.matches("#cart-modal-select-all-checkbox")) {
        this.handleSelectAll(target.checked);
        return;
      }

      // === 개별 아이템 선택 ===
      if (target.matches(".cart-item-checkbox")) {
        const productId = target.dataset.productId;
        this.handleItemSelect(productId, target.checked);
        return;
      }

      // === 선택된 아이템 삭제 ===
      if (target.matches('[data-action="remove-selected"]') || target.closest("#cart-modal-remove-selected-btn")) {
        this.handleRemoveSelected();
        return;
      }
    };

    this.handleKeyDown = (event) => {
      if (event.key === "Escape" && this.props.isVisible) {
        this.close();
      }
    };

    this.target.addEventListener("click", this.handleClick);
    document.addEventListener("keydown", this.handleKeyDown);
  }

  initializeCartSubscription() {
    // 초기 데이터 설정
    this.updateCartData();

    // 장바구니 전체 상태 구독
    this.unsubscribeCart = subscribeToCart(() => {
      this.updateCartData();
    });
  }

  updateCartData() {
    const items = getCartItems();
    const summary = getCartSummary();

    this.setState({ items, summary });
  }

  // 모달 닫기
  close() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  handleRemoveItem(productId) {
    removeFromCart(productId);
  }

  handleIncreaseQuantity(productId) {
    const item = getCartItems().find((item) => item.id === productId);
    if (item) {
      updateCartItemQuantity(productId, item.quantity + 1);
    }
  }

  handleDecreaseQuantity(productId) {
    const item = this.state.items.find((item) => item.id === productId);
    if (item && item.quantity > 1) {
      updateCartItemQuantity(productId, item.quantity - 1);
    }
  }

  handleClearCart() {
    clearCart();
    this.props.toast.show("info", "장바구니가 모두 비워졌습니다.");
  }

  handleSelectAll(checked) {
    selectAllCartItems(checked);
  }

  handleItemSelect(productId, checked) {
    selectCartItem(productId, checked);
  }

  handleRemoveSelected() {
    const selectedCount = this.state.summary.selectedCount;

    if (selectedCount === 0) {
      this.props.toast.show("info", "선택된 상품이 없습니다.");
      return;
    }

    removeSelectedCartItems();

    // 토스트 표시
    this.props.toast.show("info", "선택된 상품들이 삭제되었습니다.");
  }

  template() {
    if (!this.props.isVisible) {
      return "";
    }

    const summary = getCartSummary();
    const hasItem = summary.itemCount > 0;

    return /* html */ `
      <!-- 모달 오버레이 -->
      <div class="cart-modal-overlay flex min-h-full items-center justify-center p-0 sm:p-4 fixed inset-0 bg-black bg-opacity-50 z-50">
      
        <!-- 모달 컨테이너 -->
        <div class="cart-modal relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
          <!-- 헤더 -->
          <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
                />
              </svg>
              장바구니
              ${
                hasItem
                  ? /* html */ `<span class="text-sm font-normal text-gray-600 ml-1">(${summary.itemCount})</span>`
                  : ""
              }
            </h2>
            <button 
              data-action="close-modal"
              id="cart-modal-close-btn"
              class="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- 컨텐츠 -->
          <div class="flex flex-col max-h-[calc(90vh-120px)]">
            ${summary.isEmpty ? this.emptyCartTemplate() : this.cartWithItemsTemplate()}
          </div>

          <!-- 푸터 (총 가격 및 액션 버튼) -->
          ${!summary.isEmpty ? this.cartFooterTemplate() : ""}
        </div>
      </div>
    `;
  }

  emptyCartTemplate() {
    return /* html */ `
      <!-- 빈 장바구니 -->
      <div class="flex-1 flex items-center justify-center p-8">
        <div class="text-center">
          <div class="text-gray-400 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            장바구니가 비어있습니다
          </h3>
          <p class="text-gray-600">
            원하는 상품을 담아보세요!
          </p>
        </div>
      </div>
    `;
  }

  cartWithItemsTemplate() {
    const summary = getCartSummary();
    return /* html */ `
      <!-- 전체 선택 섹션 -->
      <div class="p-4 border-b border-gray-200 bg-gray-50">
        <label class="flex items-center text-sm text-gray-700">
          <input 
            type="checkbox" 
            id="cart-modal-select-all-checkbox" 
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
            ${summary.isAllSelected ? "checked" : ""}
          >
          전체선택 (${summary.itemCount}개)
        </label>
      </div>
      
      <!-- 아이템 목록 -->
      <div class="flex-1 overflow-y-auto">
        <div class="p-4 space-y-4">
          ${this.state.items.map((item) => this.cartItemTemplate(item)).join("")}
        </div>
      </div>
    `;
  }

  cartItemTemplate(item) {
    const isSelected = isCartItemSelected(item.id);

    return /* html */ `
      <div class="flex items-center py-3 border-b border-gray-100 cart-item" data-product-id="${item.id}">
        <!-- 선택 체크박스 -->
        <label class="flex items-center mr-3">
          <input 
            type="checkbox" 
            class="cart-item-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
            data-product-id="${item.id}"
            ${isSelected ? "checked" : ""}
          >
        </label>
        
        <!-- 상품 이미지 -->
        <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
          <img 
            src="${item.image}" 
            alt="${item.title}" 
            class="w-full h-full object-cover cursor-pointer cart-item-image" 
            data-product-id="${item.id}"
          >
        </div>
        
        <!-- 상품 정보 -->
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium text-gray-900 truncate cursor-pointer cart-item-title" 
              data-product-id="${item.id}">
            ${item.title}
          </h4>
          <p class="text-sm text-gray-600 mt-1">
            ${parseInt(item.lprice).toLocaleString()}원
          </p>
          
          <!-- 수량 조절 -->
          <div class="flex items-center mt-2">
            <button 
              data-action="decrease-quantity" 
              data-product-id="${item.id}"
              class="quantity-decrease-btn w-7 h-7 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
            <input 
              type="number" 
              value="${item.quantity}" 
              min="1" 
              data-testid="quantity-input"
              class="quantity-input w-12 h-7 text-center text-sm border-t border-b border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
              disabled 
              data-product-id="${item.id}"
            >
            <button 
              data-action="increase-quantity" 
              data-product-id="${item.id}"
              class="quantity-increase-btn w-7 h-7 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 가격 및 삭제 -->
        <div class="text-right ml-3">
          <p class="text-sm font-medium text-gray-900">
            ${(parseInt(item.lprice) * item.quantity).toLocaleString()}원
          </p>
          <button 
            data-action="remove-item" 
            data-product-id="${item.id}"
            class="cart-item-remove-btn mt-1 text-xs text-red-600 hover:text-red-800"
          >
            삭제
          </button>
        </div>
      </div>
    `;
  }

  cartFooterTemplate() {
    const { selectedCount, selectedTotal } = getCartSummary();

    return /* html */ `
      <!-- 하단 액션 -->
      <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <!-- 선택된 아이템 정보 -->
        ${
          selectedCount > 0
            ? /* html */ `
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
          <span class="text-xl font-bold text-blue-600">
            ${this.state.summary.totalPrice.toLocaleString()}원
          </span>
        </div>
        
        <!-- 액션 버튼들 -->
        <div class="space-y-2">
          ${
            selectedCount > 0
              ? /* html */ `
              <button
                data-action="remove-selected"
                id="cart-modal-remove-selected-btn"
                class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                선택한 상품 삭제 (${selectedCount}개)
              </button>
            `
              : ""
          }
          <div class="flex gap-2">
            <button 
              data-action="clear-cart"
              id="cart-modal-clear-cart-btn"
              class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm"
            >
              전체 비우기
            </button>
            <button 
              id="cart-modal-checkout-btn" 
              class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              구매하기
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
