import BaseComponent from "@/core/component";
import { ProductDetailPageViewModel } from "./view-model";
import { getProduct, getProducts } from "@/api/productApi";
import { clsx } from "clsx";
import { bulkAddToCart } from "@/store";
import { Toast } from "@/components";

import { navigateTo, getFullPath } from "@/core/router";

export default class ProductDetailPageView extends BaseComponent {
  constructor(target, params = {}) {
    super(target);
    this.productId = params.id;

    // 토스트 컴포넌트 초기화
    this.toast = null;
  }

  initialState() {
    this.setState(ProductDetailPageViewModel.INITIAL_STATE);
  }

  initializeEventHandlers() {
    this.addEventDelegate("click", "#quantity-increase", () => {
      this.handleIncreaseQuantity();
    });

    this.addEventDelegate("click", "#quantity-decrease", () => {
      this.handleDecreaseQuantity();
    });

    this.addEventDelegate("click", "#add-to-cart-btn", (e) => {
      this.handleAddToCart(e);
    });

    this.addEventDelegate("click", "#related-product-card", (e) => {
      this.handleRelatedProductClick(e);
    });

    this.addEventDelegate("input", "#quantity-input", (e) => {
      this.handleChangeQuantity(e);
    });
  }

  initializeToast() {
    const toastContainer = document.getElementById("toast-container");
    if (toastContainer) {
      this.toast = new Toast(toastContainer);
    }
  }

  async componentDidMount() {
    await this.fetchAsyncData();
    this.initializeEventHandlers();
    this.initializeToast();
  }

  async fetchAsyncData() {
    try {
      this.setState({ loading: true });

      const product = await getProduct(this.productId);
      const relatedProducts = await getProducts({
        category1: product.category1,
        category2: product.category2,
        limit: 20,
      });

      this.setState({ loading: false, product, relatedProducts: relatedProducts.products });
    } catch {
      this.setState({ isError: true });
    }
  }

  handleChangeQuantity(event) {
    const quantity = parseInt(event.target.value);
    if (quantity < 1) {
      event.target.value = 1;
    }
    this.setState({ quantity });
  }

  handleIncreaseQuantity() {
    if (this.state.quantity < this.state.product.stock) {
      this.setState({ quantity: this.state.quantity + 1 });
    }
  }
  handleDecreaseQuantity() {
    if (this.state.quantity > 1) {
      this.setState({ quantity: this.state.quantity - 1 });
    }
  }

  handleAddToCart(event) {
    event.preventDefault();

    // 장바구니에 추가할 상품 정보 구성
    const cartItem = {
      id: this.state.product.productId,
      title: this.state.product.title,
      lprice: this.state.product.lprice,
      image: this.state.product.image,
    };

    // 장바구니에 추가
    const success = bulkAddToCart(cartItem, this.state.quantity);

    if (success) {
      // 성공 시 시각적 피드백
      this.showAddToCartFeedback();
    }
  }

  handleRelatedProductClick(event) {
    event.preventDefault();
    const productId = event.target.closest("#related-product-card").dataset.productId;
    navigateTo(getFullPath(`/product/${productId}`));
  }

  /**
   * 장바구니 추가 성공 시 시각적 피드백
   */
  showAddToCartFeedback() {
    if (this.toast) {
      this.toast.show("success", "장바구니에 추가되었습니다!");
    }
  }

  template() {
    if (this.state.loading) {
      return /* html */ `
        <div class="py-20 bg-gray-50 flex items-center justify-center">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">상품 정보를 불러오는 중...</p>
          </div>
        </div>
      `;
    }

    return /* html */ `
      <nav class="mb-4">
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <a href="/" data-link="/" class="hover:text-blue-600 transition-colors">홈</a>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <button class="breadcrumb-link" data-category1="${this.state.product.category1}">
            ${this.state.product.category1}
          </button>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <button class="breadcrumb-link" data-category2="${this.state.product.category2}">
            ${this.state.product.category2}
          </button>
        </div>
      </nav>
      
      <!-- 상품 상세 정보 -->
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <!-- 상품 이미지 -->
        <div class="p-4">
          <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img src="${this.state.product.image}" alt="${this.state.product.title}" class="w-full h-full object-cover product-detail-image">
          </div>
          <!-- 상품 정보 -->
          <div>
            <p class="text-sm text-gray-600 mb-1">${this.state.product.brand}</p>
            <h1 class="text-xl font-bold text-gray-900 mb-3" data-testid="product-title">${this.state.product.title}</h1>
            <!-- 평점 및 리뷰 -->
            <div class="flex items-center mb-3">
              <div class="flex items-center">
                ${Array.from({ length: 5 }, (_, i) => {
                  const isActive = i < Math.floor(this.state.product.rating);
                  return /* html */ `
                    <svg class="w-4 h-4 ${isActive ? "text-yellow-400" : "text-gray-300"}" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  `;
                }).join("")}
              </div>
              <span class="ml-2 text-sm text-gray-600">${this.state.product.rating} (${this.state.product.reviewCount}개 리뷰)</span>
            </div>
            <!-- 가격 -->
            <div class="mb-4">
              <span class="text-2xl font-bold text-blue-600">${parseInt(this.state.product.lprice).toLocaleString()}원</span>
            </div>
            <!-- 재고 -->
            <div class="text-sm text-gray-600 mb-4">
              재고 ${this.state.product.stock}개
            </div>
            <!-- 설명 -->
            <div class="text-sm text-gray-700 leading-relaxed mb-6">
              ${this.state.product.description}
            </div>
          </div>
        </div>
        
        <!-- 수량 선택 및 액션 -->
        <div class="border-t border-gray-200 p-4">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-medium text-gray-900">수량</span>
            <div class="flex items-center">
              <button 
                id="quantity-decrease" 
                class="${clsx("w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100")}"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>
              <input
                type="number"
                id="quantity-input"
                value="${this.state.quantity}"
                min="1"
                max="${this.state.product.stock}"
                class="${clsx("w-16 h-8 text-center text-sm border-t border-b border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500", this.state.quantity === this.state.product.stock && "border-red-500")}"
              >
              <button 
                id="quantity-increase" 
                class="${clsx("w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100")}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>
          </div>
          <!-- 액션 버튼 -->
          <button 
            id="add-to-cart-btn"
            data-product-id="${this.state.product.productId}" 
            class="${clsx("w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium")}"
          >
            장바구니 담기
          </button>
        </div>
      </div>
      
      <!-- 상품 목록으로 이동 -->
      <div class="mb-6">
        <a href="/" data-link="/">
          <button class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md 
            hover:bg-gray-200 transition-colors go-to-product-list">
            상품 목록으로 돌아가기
          </button>
        </a>
      </div>
      
      <!-- 관련 상품 -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-900">관련 상품</h2>
          <p class="text-sm text-gray-600">같은 카테고리의 다른 상품들</p>
        </div>
        <div class="p-4">
          <div class="grid grid-cols-2 gap-3 responsive-grid">
            ${this.state.relatedProducts
              .filter((relatedProduct) => relatedProduct.productId !== this.state.product.productId)
              .map(
                (relatedProduct) => /* html */ `
                  <div class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer" data-product-id="${relatedProduct.productId}" id="related-product-card">
                    <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
                      <img src="${relatedProduct.image}" alt="${relatedProduct.title}" class="w-full h-full object-cover" loading="lazy">
                    </div>
                    <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${relatedProduct.title}</h3>
                    <p class="text-sm font-bold text-blue-600">${parseInt(relatedProduct.lprice).toLocaleString()}원</p>
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }
}
