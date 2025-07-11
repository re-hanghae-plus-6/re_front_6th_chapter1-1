import { ProductDetail } from './ProductDetail.js';
import { ProductService } from '../services/ProductService.js';
import { store } from '../store/index.js';

export class ProductDetailContainer {
  constructor() {
    this.productId = null;
    this.product = null;
    this.relatedProducts = [];
    this.isLoading = false;
  }

  // 상태 초기화 메서드
  reset() {
    this.productId = null;
    this.product = null;
    this.relatedProducts = [];
    this.isLoading = false;
  }

  async render(productId) {
    // 같은 상품을 로딩 중인 경우에만 중복 실행 방지
    // (이미 렌더링된 상품이라도 다시 접근할 때는 새로 로드)
    if (this.productId === productId && this.isLoading) {
      return;
    }

    // 새로운 상품으로 변경 시 상태 초기화
    if (this.productId !== productId) {
      this.product = null;
      this.relatedProducts = [];
    }

    this.productId = productId;
    this.isLoading = true;

    // Router에서 이미 Layout을 렌더링했으므로 main 부분만 업데이트
    // 별도 로딩 렌더링 불필요 (ProductDetailPage에서 이미 로딩 UI 제공)

    try {
      // 상품 상세 정보 로드
      this.product = await ProductService.fetchProductById(productId);

      // 관련 상품 로드 (같은 카테고리, 현재 상품 제외)
      await this.loadRelatedProducts();

      // 상품 상세 컴포넌트 렌더링 (Layout의 main 부분만 업데이트)
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.innerHTML = ProductDetail({
          product: this.product,
          relatedProducts: this.relatedProducts,
        });
      }

      // 이벤트 리스너 설정
      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to load product detail:', error);

      // 에러 상태 렌더링 (Layout의 main 부분만 업데이트)
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.innerHTML = ProductDetail({
          product: null,
          relatedProducts: [],
        });
      }
      this.setupBackButtonHandler();
    } finally {
      this.isLoading = false;
    }
  }

  async loadRelatedProducts() {
    try {
      if (!this.product) {
        this.relatedProducts = [];
        return;
      }

      // 카테고리 정보가 없으면 관련 상품 없음
      if (!this.product.category1 && !this.product.category2) {
        this.relatedProducts = [];
        return;
      }

      // 같은 카테고리의 상품들을 가져오기
      const filters = {};
      if (this.product.category1) filters.category1 = this.product.category1;
      if (this.product.category2) filters.category2 = this.product.category2;

      const response = await ProductService.fetchProducts({
        ...filters,
        limit: 20, // 충분한 개수를 가져와서 현재 상품 제외 후 필터링
      });

      let products =
        response.products || response.data || response.results || response;
      if (!Array.isArray(products)) {
        this.relatedProducts = [];
        return;
      }

      // 현재 상품 제외하고 최대 19개까지
      this.relatedProducts = products
        .filter((p) => p.id !== this.productId)
        .slice(0, 19);
    } catch (error) {
      console.error('Failed to load related products:', error);
      this.relatedProducts = [];
    }
  }

  setupEventListeners() {
    // 뒤로가기 버튼
    this.setupBackButtonHandler();

    // 수량 조절 버튼
    this.setupQuantityControls();

    // 장바구니 담기 버튼
    this.setupAddToCartButton();

    // 상품 목록으로 돌아가기 버튼
    this.setupGoToListButton();

    // 관련 상품 클릭
    this.setupRelatedProductsClick();

    // 브레드크럼 클릭
    this.setupBreadcrumbClick();
  }

  setupBackButtonHandler() {
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.history.back();
      });
    }
  }

  setupQuantityControls() {
    const quantityInput = document.getElementById('quantity-input');
    const decreaseBtn = document.getElementById('quantity-decrease');
    const increaseBtn = document.getElementById('quantity-increase');

    if (!quantityInput || !decreaseBtn || !increaseBtn) return;

    decreaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });

    increaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value);
      const maxValue = parseInt(quantityInput.max);
      if (currentValue < maxValue) {
        quantityInput.value = currentValue + 1;
      }
    });

    // 직접 입력 제한
    quantityInput.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      const min = parseInt(e.target.min);
      const max = parseInt(e.target.max);

      if (value < min) e.target.value = min;
      if (value > max) e.target.value = max;
    });
  }

  setupAddToCartButton() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const quantityInput = document.getElementById('quantity-input');

    if (!addToCartBtn || !this.product) return;

    addToCartBtn.addEventListener('click', () => {
      const quantity = parseInt(quantityInput?.value || 1);
      store.addToCart(this.product, quantity);
    });
  }

  setupGoToListButton() {
    const goToListBtn = document.querySelector('.go-to-product-list');
    if (goToListBtn) {
      goToListBtn.addEventListener('click', () => {
        // 상품 목록으로 돌아가기
        if (window.router) {
          this.reset(); // 상태 리셋
          window.router.navigate('/');
        }
      });
    }
  }

  setupRelatedProductsClick() {
    const relatedProductCards = document.querySelectorAll(
      '.related-product-card',
    );
    relatedProductCards.forEach((card) => {
      card.addEventListener('click', () => {
        const productId = card.dataset.productId;
        if (productId && window.router) {
          // 관련 상품 클릭 시 상품 상세 페이지로 이동
          window.router.navigate(`/product/${productId}`);
        }
      });
    });
  }

  setupBreadcrumbClick() {
    const breadcrumbLinks = document.querySelectorAll('.breadcrumb-link');
    breadcrumbLinks.forEach((link) => {
      link.addEventListener('click', () => {
        const category1 = link.dataset.category1;
        const category2 = link.dataset.category2;

        if (category1) {
          // 카테고리 필터 적용하여 메인 페이지로 이동
          const newUrl = `/?category1=${encodeURIComponent(category1)}`;
          if (window.router) {
            this.reset(); // 상태 리셋
            window.router.navigate(newUrl);
          }
        } else if (category2) {
          // 2차 카테고리 필터 적용
          const currentCategory1 = this.product?.category1;
          if (currentCategory1) {
            const newUrl = `/?category1=${encodeURIComponent(currentCategory1)}&category2=${encodeURIComponent(category2)}`;
            if (window.router) {
              this.reset(); // 상태 리셋
              window.router.navigate(newUrl);
            }
          }
        }
      });
    });
  }
}
