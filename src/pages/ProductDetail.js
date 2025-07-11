import { getProduct, getProducts } from '../api/productApi.js';
import { cart } from './Cart.js';

export class ProductDetail {
  constructor(productId) {
    this.productId = productId;
    this.product = null;
    this.relatedProducts = [];
    this.loading = true;
    this.quantity = 1;
  }

  async loadProduct() {
    try {
      this.loading = true;

      this.product = await getProduct(this.productId);

      const relatedData = await getProducts({
        category1: this.product.category1,
        limit: 20,
        page: 1,
      });

      this.relatedProducts = relatedData.products.filter(
        (p) => p.productId.toString() !== this.productId.toString(),
      );

      this.loading = false;
    } catch (error) {
      console.error('상품 정보 로드 실패:', error);
      this.loading = false;
    }
  }

  generateHtml() {
    if (this.loading) {
      return `
        <div class="min-h-screen bg-gray-50">
          <div class="max-w-7xl mx-auto px-4 py-8">
            <div class="flex items-center justify-center h-64">
              <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p class="text-gray-600">상품 정보를 불러오는 중...</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (!this.product) {
      return `
        <div class="min-h-screen bg-gray-50">
          <div class="max-w-7xl mx-auto px-4 py-8">
            <div class="text-center">
              <h1 class="text-2xl font-bold text-gray-900 mb-4">상품을 찾을 수 없습니다</h1>
              <button onclick="history.back()" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                뒤로가기
              </button>
            </div>
          </div>
        </div>
      `;
    }

    const relatedProductsHtml = this.relatedProducts
      .map(
        (product) => `
      <div class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer" data-product-id="${product.productId}">
        <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
          <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover" loading="lazy">
        </div>
        <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${product.title}</h3>
        <p class="text-sm font-bold text-blue-600">${parseInt(product.lprice).toLocaleString()}원</p>
      </div>
    `,
      )
      .join('');

    return `
      <div class="min-h-screen bg-gray-50">
        <header class="bg-white shadow-sm sticky top-0 z-40">
          <div class="max-w-md mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <button onclick="window.history.back()" class="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <h1 class="text-lg font-bold text-gray-900">상품 상세</h1>
              </div>
              <div class="flex items-center space-x-2">
                <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>
        <main class="max-w-md mx-auto px-4 py-4">
          <!-- 브레드크럼 -->
          <nav class="mb-4">
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <button id="breadcrumb-home" class="hover:text-blue-600 transition-colors">홈</button>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
              <span class="text-gray-900">${this.product.category1}</span>
            </div>
          </nav>
          <!-- 상품 상세 정보 -->
          <div class="bg-white rounded-lg shadow-sm mb-6">
            <!-- 상품 이미지 -->
            <div class="p-4">
              <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img src="${this.product.image}" alt="${this.product.title}" class="w-full h-full object-cover product-detail-image">
              </div>
              <!-- 상품 정보 -->
              <div>
                <p class="text-sm text-gray-600 mb-1">${this.product.brand || ''}</p>
                <h1 class="text-xl font-bold text-gray-900 mb-3">${this.product.title}</h1>
                <!-- 가격 -->
                <div class="mb-4">
                  <span class="text-2xl font-bold text-blue-600">${parseInt(this.product.lprice).toLocaleString()}원</span>
                </div>
                <!-- 설명 -->
                <div class="text-sm text-gray-700 leading-relaxed mb-6">
                  ${this.product.title}에 대한 상세 설명입니다. 브랜드의 우수한 품질을 자랑하는 상품으로, 고객 만족도가 높은 제품입니다.
                </div>
              </div>
            </div>
            <!-- 수량 선택 및 액션 -->
            <div class="border-t border-gray-200 p-4">
              <div class="flex items-center justify-between mb-4">
                <span class="text-sm font-medium text-gray-900">수량</span>
                <div class="flex items-center">
                  <button id="quantity-decrease" class="w-8 h-8 flex items-center justify-center border border-gray-300 
                     rounded-l-md bg-gray-50 hover:bg-gray-100">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                    </svg>
                  </button>
                  <input type="number" id="quantity-input" value="${this.quantity}" min="1" class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 
                    focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <button id="quantity-increase" class="w-8 h-8 flex items-center justify-center border border-gray-300 
                     rounded-r-md bg-gray-50 hover:bg-gray-100">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <!-- 액션 버튼 -->
              <button id="add-to-cart-btn" data-product-id="${this.product.productId}" class="w-full bg-blue-600 text-white py-3 px-4 rounded-md 
                   hover:bg-blue-700 transition-colors font-medium">
                장바구니 담기
              </button>
            </div>
          </div>
          <!-- 관련 상품 -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-4 border-b border-gray-200">
              <h2 class="text-lg font-bold text-gray-900">관련 상품</h2>
              <p class="text-sm text-gray-600">같은 카테고리의 다른 상품들</p>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-2 gap-3 responsive-grid">
                ${relatedProductsHtml}
              </div>
            </div>
          </div>
        </main>
        <footer class="bg-white shadow-sm mt-8">
          <div class="max-w-md mx-auto py-8 text-center text-gray-500">
            <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
          </div>
        </footer>
      </div>
    `;
  }

  setupEventListeners() {
    const increaseBtn = document.querySelector('#quantity-increase');
    if (increaseBtn) {
      increaseBtn.addEventListener('click', () => {
        this.quantity++;
        this.updateQuantityDisplay();
      });
    }

    const decreaseBtn = document.querySelector('#quantity-decrease');
    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', () => {
        if (this.quantity > 1) {
          this.quantity--;
          this.updateQuantityDisplay();
        }
      });
    }

    const quantityInput = document.querySelector('#quantity-input');
    if (quantityInput) {
      quantityInput.addEventListener('change', (e) => {
        const value = parseInt(e.target.value);
        if (value >= 1) {
          this.quantity = value;
          this.updateQuantityDisplay();
        } else {
          this.updateQuantityDisplay();
        }
      });
    }

    const addToCartBtn = document.querySelector('#add-to-cart-btn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        const cartProduct = {
          id: this.product.productId,
          name: this.product.title,
          price: parseInt(this.product.lprice),
          image: this.product.image,
          brand: this.product.brand || '',
        };
        cart.addItem(cartProduct, this.quantity);
      });
    }

    const relatedProductCards = document.querySelectorAll(
      '.related-product-card',
    );
    relatedProductCards.forEach((card) => {
      card.addEventListener('click', () => {
        const productId = card.dataset.productId;
        if (productId) {
          window.history.pushState({}, '', `/product/${productId}`);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      });
    });

    const homeBtn = document.querySelector('#breadcrumb-home');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }

    const cartIconBtn = document.querySelector('#cart-icon-btn');
    if (cartIconBtn) {
      cartIconBtn.addEventListener('click', () => {
        cart.openModal();
      });
    }
  }

  updateQuantityDisplay() {
    const quantityInput = document.querySelector('#quantity-input');
    if (quantityInput) {
      quantityInput.value = this.quantity;
    }
  }

  async render() {
    await this.loadProduct();
    const html = this.generateHtml();
    document.querySelector('#root').innerHTML = html;

    if (!this.loading && this.product) {
      this.setupEventListeners();
      // 장바구니 아이콘 업데이트
      cart.updateCartIcon();
    }
  }
}
