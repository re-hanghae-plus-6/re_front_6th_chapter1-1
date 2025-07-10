import Component from '../../../../core/Component.js';
import cartStore from '../../../../store/cartStore.js';
import cartLocalStorage from '../../../../store/cartLocalStorage.js';
import { numberUtils } from '../../../../utils/numberUtils.js';

class Cart extends Component {
  constructor(element, props) {
    super(element, props);
    this.unsubscribeCartStorage = null;
  }

  onMount() {
    // 장바구니 데이터 변경시 자동 리렌더
    this.unsubscribeCartStorage = cartLocalStorage.subscribe('cartProducts', () => {
      this.render();
    });
  }

  onUnmount() {
    // 구독 해제
    if (this.unsubscribeCartStorage) this.unsubscribeCartStorage();
  }

  closeCartModal() {
    cartStore.setState({
      isOpen: false,
    });
    this.unmount();
  }

  handleSelectAllItems(items) {
    const updatedCartItems = items.map((item) => {
      console.log('handleSelectAllItems', item);

      return { ...item, isSelected: !item.isSelected };
    });

    cartLocalStorage.set('cartProducts', updatedCartItems);
  }

  handleSelectItem(items, productId) {
    const updatedCartItems = items.map((item) => {
      if (item.productId !== productId) {
        return item;
      }

      return { ...item, isSelected: !item.isSelected };
    });

    cartLocalStorage.set('cartProducts', updatedCartItems);
  }

  handleChangeQuantity(items, productId, action) {
    const updatedCartItems = items.map((item) => {
      if (item.productId !== productId) {
        return item;
      }

      let newQuantity = item.quantity;
      if (action === 'increase') {
        newQuantity += 1;
      } else if (action === 'decrease') {
        newQuantity = Math.max(1, item.quantity - 1);
      }

      return { ...item, quantity: newQuantity };
    });

    cartLocalStorage.set('cartProducts', updatedCartItems);
  }

  handleRemoveItem(items, productId) {
    const updatedCartItems = items.filter((item) => {
      return item.productId !== productId;
    });

    cartLocalStorage.set('cartProducts', updatedCartItems);
  }

  handleClearAllItems() {
    cartLocalStorage.set('cartProducts', []);
    cartLocalStorage.remove('cartProducts');
  }

  attachEventListeners() {
    this.addEventListener(this.element, 'click', (event) => {
      if (event.target.closest('#cart-modal-close-btn')) {
        this.closeCartModal();
        return;
      }

      const cartState = cartStore.getState();
      if (!event.target.closest('#cart-content') && cartState.isOpen) {
        this.closeCartModal();
        return;
      }

      const products = cartLocalStorage.get('cartProducts');
      const decreaseBtn = event.target.closest('.quantity-decrease-btn');
      if (decreaseBtn) {
        const productId = decreaseBtn.dataset.productId;
        this.handleChangeQuantity(products, productId, 'decrease');
        return;
      }

      const increaseBtn = event.target.closest('.quantity-increase-btn');
      if (increaseBtn) {
        const productId = increaseBtn.dataset.productId;
        this.handleChangeQuantity(products, productId, 'increase');
        return;
      }

      const checkbox = event.target.closest('.cart-item-checkbox');
      if (checkbox) {
        const productId = checkbox.dataset.productId;
        this.handleSelectItem(products, productId);
        return;
      }

      const allCheckbox = event.target.closest('#cart-modal-select-all-checkbox');
      if (allCheckbox) {
        this.handleSelectAllItems(products);
      }

      const cartItemRemoveBtn = event.target.closest('.cart-item-remove-btn');
      if (cartItemRemoveBtn) {
        const productId = cartItemRemoveBtn.dataset.productId;
        this.handleRemoveItem(products, productId);
      }

      const cartAllItemsRemoveBtn = event.target.closest('#cart-modal-clear-cart-btn');
      if (cartAllItemsRemoveBtn) {
        this.handleClearAllItems();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeCartModal();
      }
    });
  }

  renderCartEmpty() {
    return /* HTML */ `
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
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">장바구니가 비어있습니다</h3>
          <p class="text-gray-600">원하는 상품을 담아보세요!</p>
        </div>
      </div>
    `;
  }

  renderCartSelectAllBar(cartItemsLength, isAllSelected) {
    return /* HTML */ `
      <div class="p-4 border-b border-gray-200 bg-gray-50">
        <label class="flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            id="cart-modal-select-all-checkbox"
            ${isAllSelected ? 'checked' : ''}
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
          />
          전체선택 (${cartItemsLength}개)
        </label>
      </div>
    `;
  }

  renderCartItems(cartItems) {
    return /* HTML */ `
      <div class="flex-1 overflow-y-auto">
        ${cartItems
          .map((item) => {
            return /* HTML */ `
              <div class="p-4 space-y-4">
                <div
                  class="flex items-center py-3 border-b border-gray-100 cart-item"
                  data-product-id="${item.productId}"
                >
                  <!-- 선택 체크박스 -->
                  <label class="flex items-center mr-3">
                    <input
                      type="checkbox"
                      ${item.isSelected ? 'checked' : ''}
                      class="cart-item-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded
                focus:ring-blue-500"
                      data-product-id="${item.productId}"
                    />
                  </label>
                  <!-- 상품 이미지 -->
                  <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                    <img
                      src="${item.image}"
                      alt="${item.title}"
                      class="w-full h-full object-cover cursor-pointer cart-item-image"
                      data-product-id="${item.productId}"
                    />
                  </div>
                  <!-- 상품 정보 -->
                  <div class="flex-1 min-w-0">
                    <h4
                      class="text-sm font-medium text-gray-900 truncate cursor-pointer cart-item-title"
                      data-product-id="${item.productId}"
                    >
                      ${item.title}
                    </h4>
                    <p class="text-sm text-gray-600 mt-1">${numberUtils.comma(item.lprice)}원</p>
                    <!-- 수량 조절 -->
                    <div class="flex items-center mt-2">
                      <button
                        class="quantity-decrease-btn w-7 h-7 flex items-center justify-center
                 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                        data-product-id="${item.productId}"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M20 12H4"
                          ></path>
                        </svg>
                      </button>
                      <input
                        type="number"
                        value="${item.quantity}"
                        min="1"
                        class="quantity-input w-12 h-7 text-center text-sm border-t border-b
                border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        disabled=""
                        data-product-id="${item.productId}"
                      />
                      <button
                        class="quantity-increase-btn w-7 h-7 flex items-center justify-center
                 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                        data-product-id="${item.productId}"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 4v16m8-8H4"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <!-- 가격 및 삭제 -->
                  <div class="text-right ml-3">
                    <p class="text-sm font-medium text-gray-900">
                      ${numberUtils.comma(item.quantity * item.lprice)}원
                    </p>
                    <button
                      class="cart-item-remove-btn mt-1 text-xs text-red-600 hover:text-red-800"
                      data-product-id="${item.productId}"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            `;
          })
          .join('')}
      </div>
    `;
  }

  renderCartBottomBar() {
    return /* HTML */ `
      <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <!-- 선택된 아이템 정보 -->
        <!-- 총 금액 -->
        <div class="flex justify-between items-center mb-4">
          <span class="text-lg font-bold text-gray-900">총 금액</span>
          <span class="text-xl font-bold text-blue-600">670원</span>
        </div>
        <!-- 액션 버튼들 -->
        <div class="space-y-2">
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
      </div>
    `;
  }

  render() {
    const cartItems = cartLocalStorage.get('cartProducts') || [];
    const isAllSelected = cartItems.length > 0 && cartItems.every((item) => item.isSelected);

    this.element.innerHTML = /* HTML */ `
      <div class="cart-modal-overlay fixed top-0 left-0 w-full h-full bg-[#000]/30 z-[100]">
        <div class="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
          <div
            id="cart-content"
            class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden"
          >
            <!-- 헤더 -->
            <div
              class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between"
            >
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
                ${cartItems.length
                  ? `<span class="text-sm font-normal text-gray-600 ml-1">(${cartItems.length})</span>`
                  : ''}
              </h2>

              <button id="cart-modal-close-btn" class="text-gray-400 hover:text-gray-600 p-1">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <!-- 컨텐츠 -->
            <div class="flex flex-col max-h-[calc(90vh-120px)]">
              ${cartItems.length
                ? /* HTML */ `
                    ${this.renderCartSelectAllBar(cartItems.length, isAllSelected)}
                    ${this.renderCartItems(cartItems)} ${this.renderCartBottomBar()}
                  `
                : this.renderCartEmpty()}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

export default Cart;
