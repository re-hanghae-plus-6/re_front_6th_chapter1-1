class Cart {
  constructor() {
    this.storageKey = 'shopping_cart';
    this.cart = this.loadFromStorage();
    this.isModalOpen = false;
    this.toastTimeout = null;
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('장바구니 데이터 로드 실패:', error);
      return {};
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
    } catch (error) {
      console.error('장바구니 데이터 저장 실패:', error);
    }
  }

  addItem(product, quantity = 1) {
    const productId = product.id.toString();

    if (this.cart[productId]) {
      this.cart[productId].quantity += quantity;
    } else {
      this.cart[productId] = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand || '',
        quantity: quantity,
      };
    }

    this.saveToStorage();
    this.updateCartIcon();
    this.showToast('장바구니에 추가되었습니다');
  }

  removeItem(productId) {
    delete this.cart[productId.toString()];
    this.saveToStorage();
    this.updateCartIcon();
  }

  updateQuantity(productId, quantity) {
    const id = productId.toString();
    if (this.cart[id] && quantity > 0) {
      this.cart[id].quantity = quantity;
      this.saveToStorage();
      this.updateCartIcon();
    }
  }

  clearCart() {
    this.cart = {};
    this.saveToStorage();
    this.updateCartIcon();
  }

  removeSelectedItems(selectedIds) {
    selectedIds.forEach((id) => {
      delete this.cart[id.toString()];
    });
    this.saveToStorage();
    this.updateCartIcon();
    this.showToast('선택된 상품들이 삭제되었습니다');
  }

  updateCartIcon() {
    const cartIcon = document.querySelector('#cart-icon-btn');
    if (!cartIcon) return;

    const itemCount = this.getItemCount();
    let countSpan = cartIcon.querySelector('span');

    if (itemCount > 0) {
      if (!countSpan) {
        countSpan = document.createElement('span');
        countSpan.className =
          'absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center';
        cartIcon.appendChild(countSpan);
      }
      countSpan.textContent = itemCount;
    } else {
      if (countSpan) {
        countSpan.remove();
      }
    }
  }

  getItemCount() {
    return Object.keys(this.cart).length;
  }

  getTotalQuantity() {
    return Object.values(this.cart).reduce(
      (total, item) => total + item.quantity,
      0,
    );
  }

  getTotalPrice() {
    return Object.values(this.cart).reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }

  getSelectedTotalPrice(selectedIds) {
    return selectedIds.reduce((total, id) => {
      const item = this.cart[id.toString()];
      return item ? total + item.price * item.quantity : total;
    }, 0);
  }

  showToast(message, type = 'success') {
    this.hideToast();

    const toast = document.createElement('div');
    toast.className = `fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm ${
      type === 'success'
        ? 'bg-green-600 text-white'
        : type === 'info'
          ? 'bg-blue-600 text-white'
          : 'bg-red-600 text-white'
    }`;

    toast.innerHTML = `
      <div class="flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${
            type === 'success'
              ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
              : type === 'info'
                ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'
                : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
          }
        </svg>
      </div>
      <p class="text-sm font-medium">${message}</p>
      <button class="toast-close-btn flex-shrink-0 ml-2 hover:text-gray-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;

    document.body.appendChild(toast);

    toast.querySelector('.toast-close-btn').addEventListener('click', () => {
      this.hideToast();
    });

    this.toastTimeout = setTimeout(() => {
      this.hideToast();
    }, 3000);
  }

  hideToast() {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    const existingToast = document.querySelector('.fixed.top-4');
    if (existingToast) {
      existingToast.remove();
    }
  }

  openModal() {
    if (this.isModalOpen) return;

    this.isModalOpen = true;
    const modalHtml = this.generateModalHtml();

    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-50 overflow-y-auto cart-modal';
    overlay.innerHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity cart-modal-overlay"></div>
      ${modalHtml}
    `;

    document.body.appendChild(overlay);

    this.setupModalEventListeners();

    document.addEventListener('keydown', this.handleEscKey);
  }

  closeModal() {
    if (!this.isModalOpen) return;

    this.isModalOpen = false;
    const modal = document.querySelector('.cart-modal');
    if (modal) {
      modal.remove();
    }

    // ESC 키 이벤트 제거
    document.removeEventListener('keydown', this.handleEscKey);
  }

  handleEscKey = (e) => {
    if (e.key === 'Escape') {
      this.closeModal();
    }
  };

  generateModalHtml() {
    const items = Object.values(this.cart);
    const totalPrice = this.getTotalPrice();

    if (items.length === 0) {
      return `
        <div class="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
          <div class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
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
          </div>
        </div>
      `;
    }

    const itemsHtml = items
      .map(
        (item) => `
      <div class="flex items-center py-3 border-b border-gray-100 cart-item" data-product-id="${item.id}">
        <label class="flex items-center mr-3">
          <input type="checkbox" class="cart-item-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" data-product-id="${item.id}">
        </label>
        <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover cursor-pointer cart-item-image" data-product-id="${item.id}">
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium text-gray-900 truncate cursor-pointer cart-item-title" data-product-id="${item.id}">
            ${item.name}
          </h4>
          <p class="text-sm text-gray-600 mt-1">${item.price.toLocaleString()}원</p>
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
        <div class="text-right ml-3">
          <p class="text-sm font-medium text-gray-900">${(item.price * item.quantity).toLocaleString()}원</p>
          <button class="cart-item-remove-btn mt-1 text-xs text-red-600 hover:text-red-800" data-product-id="${item.id}">삭제</button>
        </div>
      </div>
    `,
      )
      .join('');

    return `
      <div class="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
        <div class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
          <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
              </svg>
              장바구니
              <span class="text-sm font-normal text-gray-600 ml-1">(${items.length})</span>
            </h2>
            <button id="cart-modal-close-btn" class="text-gray-400 hover:text-gray-600 p-1">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="flex flex-col max-h-[calc(90vh-120px)]">
            <div class="p-4 border-b border-gray-200 bg-gray-50">
              <label class="flex items-center text-sm text-gray-700">
                <input type="checkbox" id="cart-modal-select-all-checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2">
                전체선택 (${items.length}개)
              </label>
            </div>
            <div class="flex-1 overflow-y-auto">
              <div class="p-4 space-y-4">
                ${itemsHtml}
              </div>
            </div>
          </div>
          <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <div id="selected-info" class="hidden flex justify-between items-center mb-3 text-sm">
              <span class="text-gray-600">선택한 상품 (<span id="selected-count">0</span>개)</span>
              <span class="font-medium"><span id="selected-price">0</span>원</span>
            </div>
            <div class="flex justify-between items-center mb-4">
              <span class="text-lg font-bold text-gray-900">총 금액</span>
              <span class="text-xl font-bold text-blue-600">${totalPrice.toLocaleString()}원</span>
            </div>
            <div class="space-y-2">
              <button id="cart-modal-remove-selected-btn" class="hidden w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm">
                선택한 상품 삭제 (<span id="selected-count-btn">0</span>개)
              </button>
              <div class="flex gap-2">
                <button id="cart-modal-clear-cart-btn" class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm">
                  전체 비우기
                </button>
                <button id="cart-modal-checkout-btn" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm">
                  구매하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupModalEventListeners() {
    const modal = document.querySelector('.cart-modal');
    if (!modal) return;

    modal
      .querySelector('#cart-modal-close-btn')
      ?.addEventListener('click', () => {
        this.closeModal();
      });

    modal
      .querySelector('.cart-modal-overlay')
      ?.addEventListener('click', () => {
        this.closeModal();
      });

    const selectAllCheckbox = modal.querySelector(
      '#cart-modal-select-all-checkbox',
    );
    selectAllCheckbox?.addEventListener('change', (e) => {
      this.handleSelectAll(e.target.checked);
    });

    modal.querySelectorAll('.cart-item-checkbox').forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        this.updateSelectedInfo();
      });
    });

    modal.querySelectorAll('.quantity-decrease-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const productId = e.target.closest('button').dataset.productId;
        this.decreaseQuantity(productId);
      });
    });

    modal.querySelectorAll('.quantity-increase-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const productId = e.target.closest('button').dataset.productId;
        this.increaseQuantity(productId);
      });
    });

    modal.querySelectorAll('.cart-item-remove-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const productId = e.target.dataset.productId;
        this.removeItem(productId);
        this.refreshModal();
      });
    });

    modal
      .querySelector('#cart-modal-remove-selected-btn')
      ?.addEventListener('click', () => {
        this.removeSelectedItems(this.getSelectedProductIds());
        this.refreshModal();
      });

    modal
      .querySelector('#cart-modal-clear-cart-btn')
      ?.addEventListener('click', () => {
        this.clearCart();
        this.refreshModal();
      });

    modal
      .querySelector('#cart-modal-checkout-btn')
      ?.addEventListener('click', () => {
        alert('구매 기능은 아직 구현되지 않았습니다.');
      });
  }

  handleSelectAll(checked) {
    const modal = document.querySelector('.cart-modal');
    if (!modal) return;

    modal.querySelectorAll('.cart-item-checkbox').forEach((checkbox) => {
      checkbox.checked = checked;
    });

    this.updateSelectedInfo();
  }

  updateSelectedInfo() {
    const selectedIds = this.getSelectedProductIds();
    const selectedCount = selectedIds.length;
    const selectedPrice = this.getSelectedTotalPrice(selectedIds);

    const selectedInfo = document.querySelector('#selected-info');
    const removeSelectedBtn = document.querySelector(
      '#cart-modal-remove-selected-btn',
    );
    const selectAllCheckbox = document.querySelector(
      '#cart-modal-select-all-checkbox',
    );

    if (selectedCount > 0) {
      selectedInfo?.classList.remove('hidden');
      removeSelectedBtn?.classList.remove('hidden');

      document.querySelector('#selected-count').textContent = selectedCount;
      document.querySelector('#selected-price').textContent =
        selectedPrice.toLocaleString();
      document.querySelector('#selected-count-btn').textContent = selectedCount;
    } else {
      selectedInfo?.classList.add('hidden');
      removeSelectedBtn?.classList.add('hidden');
    }

    const totalItems = Object.keys(this.cart).length;
    if (selectAllCheckbox) {
      selectAllCheckbox.checked =
        selectedCount === totalItems && totalItems > 0;
      selectAllCheckbox.indeterminate =
        selectedCount > 0 && selectedCount < totalItems;
    }
  }

  getSelectedProductIds() {
    const modal = document.querySelector('.cart-modal');
    if (!modal) return [];

    const selectedCheckboxes = modal.querySelectorAll(
      '.cart-item-checkbox:checked',
    );
    return Array.from(selectedCheckboxes).map(
      (checkbox) => checkbox.dataset.productId,
    );
  }

  increaseQuantity(productId) {
    const item = this.cart[productId.toString()];
    if (item) {
      this.updateQuantity(productId, item.quantity + 1);
      this.refreshModal();
    }
  }

  decreaseQuantity(productId) {
    const item = this.cart[productId.toString()];
    if (item && item.quantity > 1) {
      this.updateQuantity(productId, item.quantity - 1);
      this.refreshModal();
    }
  }

  refreshModal() {
    if (!this.isModalOpen) return;

    const modal = document.querySelector('.cart-modal');
    if (modal) {
      modal.remove();
    }

    this.isModalOpen = false;
    this.openModal();
  }

  init() {
    this.updateCartIcon();
  }
}

export const cart = new Cart();
