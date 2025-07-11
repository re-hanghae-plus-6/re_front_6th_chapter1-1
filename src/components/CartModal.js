export class CartModal {
  constructor(store) {
    this.store = store;
    this.selectedItems = new Set(); // 선택된 상품 ID들

    // 로컬 스토리지에서 선택 상태 복원
    this.loadSelectedItemsFromStorage();
  }

  // 선택 상태를 localStorage에 저장
  saveSelectedItemsToStorage() {
    try {
      const selectedArray = Array.from(this.selectedItems);
      localStorage.setItem(
        'cart-selected-items',
        JSON.stringify(selectedArray),
      );
    } catch (error) {
      console.error('Failed to save selected items to storage:', error);
    }
  }

  // localStorage에서 선택 상태 복원
  loadSelectedItemsFromStorage() {
    try {
      const savedSelectedItems = localStorage.getItem('cart-selected-items');
      if (savedSelectedItems) {
        const selectedArray = JSON.parse(savedSelectedItems);
        this.selectedItems = new Set(selectedArray);

        // 장바구니에 없는 상품의 선택 상태는 제거
        this.cleanupSelectedItems();
      }
    } catch (error) {
      console.error('Failed to load selected items from storage:', error);
      this.selectedItems = new Set();
    }
  }

  // 장바구니에 없는 상품의 선택 상태 정리
  cleanupSelectedItems() {
    const cartProductIds = new Set(
      this.store.state.cart.map((item) => item.id),
    );
    const validSelectedItems = new Set();

    this.selectedItems.forEach((productId) => {
      if (cartProductIds.has(productId)) {
        validSelectedItems.add(productId);
      }
    });

    this.selectedItems = validSelectedItems;
    this.saveSelectedItemsToStorage();
  }

  render() {
    const { cart } = this.store.state;

    // 장바구니에 없는 상품의 선택 상태 정리
    this.cleanupSelectedItems();

    if (cart.length === 0) {
      return this.renderEmptyCart();
    }

    const hasSelectedItems = this.selectedItems.size > 0;
    return hasSelectedItems
      ? this.renderCartWithSelection()
      : this.renderCartNoSelection();
  }

  renderEmptyCart() {
    return `
      <div class="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4" id="cart-modal-content-wrapper">
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
    `;
  }

  renderCartNoSelection() {
    const { cart } = this.store.state;
    const totalPrice = this.store.getCartTotal();

    return `
      <div class="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4" id="cart-modal-content-wrapper">
        <div class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
          <!-- 헤더 -->
          <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
              </svg>
              장바구니
              <span class="text-sm font-normal text-gray-600 ml-1">(${cart.length})</span>
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
                전체선택 (${cart.length}개)
              </label>
            </div>
            <!-- 아이템 목록 -->
            <div class="flex-1 overflow-y-auto">
              <div class="p-4 space-y-4">
                ${cart.map((item) => this.renderCartItem(item, false)).join('')}
              </div>
            </div>
          </div>
          <!-- 하단 액션 -->
          <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <!-- 총 금액 -->
            <div class="flex justify-between items-center mb-4">
              <span class="text-lg font-bold text-gray-900">총 금액</span>
              <span class="text-xl font-bold text-blue-600">${totalPrice.toLocaleString()}원</span>
            </div>
            <!-- 액션 버튼들 -->
            <div class="space-y-2">
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
    `;
  }

  renderCartWithSelection() {
    const { cart } = this.store.state;
    const totalPrice = this.store.getCartTotal();
    const selectedCount = this.selectedItems.size;
    const selectedTotal = this.calculateSelectedTotal();

    return `
      <div class="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4" id="cart-modal-content-wrapper">
        <div class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
          <!-- 헤더 -->
          <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
              </svg>
              장바구니
              <span class="text-sm font-normal text-gray-600 ml-1">(${cart.length})</span>
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
                <input type="checkbox" id="cart-modal-select-all-checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2" ${this.selectedItems.size === cart.length ? 'checked' : ''}>
                전체선택 (${cart.length}개)
              </label>
            </div>
            <!-- 아이템 목록 -->
            <div class="flex-1 overflow-y-auto">
              <div class="p-4 space-y-4">
                ${cart.map((item) => this.renderCartItem(item, this.selectedItems.has(item.id))).join('')}
              </div>
            </div>
          </div>
          <!-- 하단 액션 -->
          <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <!-- 선택된 아이템 정보 -->
            <div class="flex justify-between items-center mb-3 text-sm">
              <span class="text-gray-600">선택한 상품 (${selectedCount}개)</span>
              <span class="font-medium">${selectedTotal.toLocaleString()}원</span>
            </div>
            <!-- 총 금액 -->
            <div class="flex justify-between items-center mb-4">
              <span class="text-lg font-bold text-gray-900">총 금액</span>
              <span class="text-xl font-bold text-blue-600">${totalPrice.toLocaleString()}원</span>
            </div>
            <!-- 액션 버튼들 -->
            <div class="space-y-2">
              <button id="cart-modal-remove-selected-btn" class="w-full bg-red-600 text-white py-2 px-4 rounded-md 
                         hover:bg-red-700 transition-colors text-sm">
                선택한 상품 삭제 (${selectedCount}개)
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
    `;
  }

  renderCartItem(item, isSelected) {
    const itemTotal = item.price * item.quantity;

    return `
      <div class="flex items-center py-3 border-b border-gray-100 cart-item" data-product-id="${item.id}">
        <!-- 선택 체크박스 -->
        <label class="flex items-center mr-3">
          <input type="checkbox" class="cart-item-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded 
        focus:ring-blue-500" data-product-id="${item.id}" ${isSelected ? 'checked' : ''}>
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
        border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" disabled data-product-id="${item.id}">
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
            ${itemTotal.toLocaleString()}원
          </p>
          <button class="cart-item-remove-btn mt-1 text-xs text-red-600 hover:text-red-800" data-product-id="${item.id}">
            삭제
          </button>
        </div>
      </div>
    `;
  }

  calculateSelectedTotal() {
    const { cart } = this.store.state;
    return cart
      .filter((item) => this.selectedItems.has(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  }

  setupEventListeners(container) {
    // 모달 닫기
    const closeBtn = container.querySelector('#cart-modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.store.toggleCart();
      });
    }

    // 전체 선택/해제
    const selectAllCheckbox = container.querySelector(
      '#cart-modal-select-all-checkbox',
    );
    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          // 전체 선택
          this.store.state.cart.forEach((item) => {
            this.selectedItems.add(item.id);
          });
        } else {
          // 전체 해제
          this.selectedItems.clear();
        }
        this.saveSelectedItemsToStorage();
        this.rerender();
      });
    }

    // 개별 상품 선택/해제
    const itemCheckboxes = container.querySelectorAll('.cart-item-checkbox');
    itemCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', (e) => {
        const productId = e.target.dataset.productId;
        if (e.target.checked) {
          this.selectedItems.add(productId);
        } else {
          this.selectedItems.delete(productId);
        }
        this.saveSelectedItemsToStorage();
        this.rerender();
      });
    });

    // 수량 증가
    const increaseButtons = container.querySelectorAll(
      '.quantity-increase-btn',
    );
    increaseButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const productId = e.currentTarget.dataset.productId;
        const currentItem = this.store.state.cart.find(
          (item) => item.id === productId,
        );
        if (currentItem) {
          this.store.updateCartQuantity(productId, currentItem.quantity + 1);
        }
      });
    });

    // 수량 감소
    const decreaseButtons = container.querySelectorAll(
      '.quantity-decrease-btn',
    );
    decreaseButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const productId = e.currentTarget.dataset.productId;
        const currentItem = this.store.state.cart.find(
          (item) => item.id === productId,
        );
        if (currentItem && currentItem.quantity > 1) {
          this.store.updateCartQuantity(productId, currentItem.quantity - 1);
        }
      });
    });

    // 상품 삭제
    const removeButtons = container.querySelectorAll('.cart-item-remove-btn');
    removeButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const productId = e.currentTarget.dataset.productId;
        this.store.removeFromCart(productId);
        this.selectedItems.delete(productId);
        this.saveSelectedItemsToStorage();
      });
    });

    // 선택한 상품 삭제
    const removeSelectedBtn = container.querySelector(
      '#cart-modal-remove-selected-btn',
    );
    if (removeSelectedBtn) {
      removeSelectedBtn.addEventListener('click', () => {
        const selectedCount = this.selectedItems.size;
        this.selectedItems.forEach((productId) => {
          this.store.removeFromCart(productId, false); // 토스트 표시하지 않음
        });
        this.selectedItems.clear();
        this.saveSelectedItemsToStorage();

        if (selectedCount > 0) {
          this.store.showToast('선택된 상품들이 삭제되었습니다', 'info');
        }
      });
    }

    // 전체 비우기
    const clearCartBtn = container.querySelector('#cart-modal-clear-cart-btn');
    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', () => {
        const cartCount = this.store.state.cart.length;
        this.store.clearCart();
        this.selectedItems.clear();
        this.saveSelectedItemsToStorage();

        if (cartCount > 0) {
          this.store.showToast('장바구니가 비워졌습니다', 'info');
        }
      });
    }

    // 구매하기
    const checkoutBtn = container.querySelector('#cart-modal-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        this.store.showToast('구매 기능은 아직 구현되지 않았습니다.');
      });
    }

    // 상품 이미지/제목 클릭 시 상세 페이지로 이동
    const productLinks = container.querySelectorAll(
      '.cart-item-image, .cart-item-title',
    );
    productLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const productId = e.currentTarget.dataset.productId;
        if (window.router) {
          window.router.navigate(`/product/${productId}`);
        }
        this.store.toggleCart(); // 모달 닫기
      });
    });
  }

  renderWithBackdrop(container) {
    // 배경과 함께 전체 모달을 렌더링
    container.innerHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" id="cart-modal-backdrop">
        ${this.render()}
      </div>
    `;
    this.setupEventListeners(container);
    this.setupBackdropClick(container);
  }

  setupBackdropClick(container) {
    // 배경 클릭 시 모달 닫기
    const backdrop = container.querySelector('#cart-modal-backdrop');
    const contentWrapper = container.querySelector(
      '#cart-modal-content-wrapper',
    );

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        // backdrop 자체를 클릭하거나 content-wrapper를 클릭한 경우 모달 닫기
        if (e.target === backdrop || e.target === contentWrapper) {
          this.store.toggleCart();
        }
      });
    }
  }

  rerender() {
    const modalContainer = document.querySelector('#cart-modal-container');
    if (modalContainer) {
      this.renderWithBackdrop(modalContainer);
    }
  }
}
