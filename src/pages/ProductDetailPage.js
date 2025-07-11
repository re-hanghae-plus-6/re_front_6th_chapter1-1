import stateManager from "../state/index.js";
import QuantitySelector from "../components/QuantitySelector.js";
import RelatedProducts from "../components/RelatedProducts.js";

class ProductDetailPage {
  constructor(productId) {
    this.productId = productId;
    this.quantitySelector = null;
    this.relatedProducts = null;
    this.unsubscribe = null;
  }

  /**
   * 페이지 초기화 및 상품 로딩 시작
   */
  mounted() {
    // 상태 구독
    this.setupSubscriptions();

    // 상품 정보 패치
    stateManager.productDetail.loadProduct(this.productId);
  }

  /**
   * 컴포넌트가 언마운트될 때 정리
   */
  unmounted() {
    if (this.quantitySelector) {
      this.quantitySelector.unmounted();
      this.quantitySelector = null;
    }
    if (this.relatedProducts) {
      this.relatedProducts.unmounted();
      this.relatedProducts = null;
    }
    stateManager.productDetail.reset();
    if (this.unsubscribe) this.unsubscribe();
  }

  // =============== 상태 구독 메서드 ===============
  /**
   * 상태 구독 설정
   */
  setupSubscriptions() {
    // 로딩 상태 구독
    stateManager.productDetail.subscribe(["loading"], () => {
      this.renderLoading();
    });

    // 상품 정보 구독
    stateManager.productDetail.subscribe(["product"], () => {
      this.renderProduct();
    });

    // 에러 구독독
    stateManager.productDetail.subscribe(["error"], () => {
      this.renderError();
    });
  }

  /**
   * 장바구니 추가 핸들러
   */
  handleAddToCart = () => {
    const { product } = stateManager.productDetail.state;
    if (!product || !this.quantitySelector) return;

    const quantity = this.quantitySelector.getValue();
    const productData = this.createProductData(product, quantity);
    stateManager.addProductToCart(productData);
  };

  /**
   * 장바구니용 상품 데이터 생성
   */
  createProductData(product, quantity) {
    return {
      id: product.productId,
      title: product.title,
      name: product.title,
      price: parseInt(product.lprice),
      image: product.image,
      quantity: quantity,
      category1: product.category1,
      category2: product.category2,
    };
  }

  /**
   * 목록 페이지로 이동
   */
  goToList(category1 = "", category2 = "") {
    const currentState = stateManager.productList.state;
    const searchParams = new URLSearchParams();

    // 카테고리 정보 추가
    if (category1) searchParams.set("category1", category1);
    if (category2) searchParams.set("category2", category2);

    // 기존 검색 조건 유지
    if (currentState.sort) searchParams.set("sort", currentState.sort);
    if (currentState.search) searchParams.set("search", currentState.search);
    if (currentState.page > 1) searchParams.set("page", currentState.page);

    // URL 생성 및 이동
    const queryString = searchParams.toString();
    window.location.href = queryString ? `/?${queryString}` : "/";
  }

  /**
   * 이벤트 핸들러 연결
   */
  attachEvents() {
    if (this.quantitySelector) {
      this.quantitySelector.mounted();
    }
    if (this.relatedProducts) {
      this.relatedProducts.mounted();
    }

    // 장바구니 버튼
    const addToCartBtn = document.getElementById("add-to-cart-btn");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", this.handleAddToCart);
    }

    // 목록으로 돌아가기 버튼들
    const backToListBtns = document.querySelectorAll(".back-to-list-btn");
    backToListBtns.forEach((btn) => {
      btn.addEventListener("click", () => this.goToList());
    });

    // 브레드크럼블 링크들
    const breadcrumbLinks = document.querySelectorAll(".breadcrumb-link");
    breadcrumbLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const category1 = e.target.dataset.category;
        const category2 = e.target.dataset.subcategory;
        this.goToList(category1, category2);
      });
    });
  }

  // =============== html 반환 메서드 ===============
  /**
   * 로딩 인디케이터 HTML을 반환합니다
   * @returns {string} 로딩 인디케이터 HTML
   */
  getLoadingIndicatorHtml() {
    return /*html*/ `
      <div class="py-20 bg-gray-50 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    `;
  }

  // =============== 렌더링 메서드 ===============
  /**
   * 로딩 상태 렌더링
   */
  renderLoading() {
    const { loading } = stateManager.productDetail.state;
    if (!loading) return;

    const pageContent = document.getElementById("page-content");
    if (!pageContent) return;

    pageContent.innerHTML = this.getLoadingIndicatorHtml();
  }

  /**
   * 에러 상태 렌더링
   */
  renderError() {
    const { error } = stateManager.productDetail.state;
    if (!error) return;

    const pageContent = document.getElementById("page-content");
    if (!pageContent) return;

    pageContent.innerHTML = /*html*/ `
      <div class="container mx-auto px-4 py-8">
        <div class="text-center py-16">
          <div class="mb-4">
            <svg class="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">상품을 찾을 수 없습니다</h2>
          <p class="text-gray-600 mb-6">${error || "상품 정보를 불러오는데 실패했습니다."}</p>
          <button 
            class="back-to-list-btn bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    `;
  }

  /**
   * 상품 정보 렌더링
   */
  renderProduct() {
    const { product } = stateManager.productDetail.state;
    if (!product) return;

    const pageContent = document.getElementById("page-content");
    if (!pageContent) return;

    const formattedPrice = parseInt(product.lprice).toLocaleString();
    this.quantitySelector = new QuantitySelector({
      initialValue: 1,
      min: 1,
      max: 999,
      onChange: () => {},
    });

    this.relatedProducts = new RelatedProducts(product);

    pageContent.innerHTML = /*html*/ `
      <!-- 브레드크럼 -->
      ${this.renderBreadcrumb(product)}

      <!-- 상품 상세 정보 -->
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <div class="p-4">
          <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img src="${product.image}" 
                  alt="${product.title}" 
                  class="w-full h-full object-cover">
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-1">${product.brand || ""}</p>
            <h1 class="text-xl font-bold text-gray-900 mb-3">${product.title}</h1>
            <div class="mb-4">
              <span class="text-2xl font-bold text-blue-600">${formattedPrice}원</span>
            </div>
            <div class="text-sm text-gray-700 leading-relaxed mb-6">
              ${product.description || ""}
            </div>
          </div>
        </div>

        <!-- 수량 선택 및 액션 -->
        <div class="border-t border-gray-200 p-4">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-medium text-gray-900">수량</span>
            <div id="quantity-selector-container">
              ${this.quantitySelector.render()}
            </div>
          </div>
          <button 
            id="add-to-cart-btn" 
            data-product-id="${product.productId}" 
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            장바구니 담기
          </button>
        </div>
      </div>

      <!-- 상품 목록으로 이동 -->
      <div class="mb-6">
        <button 
          class="back-to-list-btn block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors"
        >
          상품 목록으로 돌아가기
        </button>
      </div>

      <!-- 관련 상품 -->
      ${this.relatedProducts.render()}
    `;

    this.attachEvents();
    return;
  }

  /**
   * 브레드크럼 생성
   */
  renderBreadcrumb(product) {
    const { category1, category2 } = product;

    let breadcrumbHtml = /*html*/ `
      <nav class="mb-4">
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <button 
            data-category="" 
            class="breadcrumb-link hover:text-blue-600 transition-colors"
          >홈</button>
    `;

    if (category1) {
      breadcrumbHtml += /*html*/ `
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <button 
          data-category="${category1}"
          class="breadcrumb-link hover:text-blue-600 transition-colors"
        >${category1}</button>
      `;
    }

    if (category2) {
      breadcrumbHtml += /*html*/ `
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <button 
          data-category="${category1}" 
          data-subcategory="${category2}"
          class="breadcrumb-link hover:text-blue-600 transition-colors"
        >${category2}</button>
      `;
    }

    breadcrumbHtml += /*html*/ `
      </div></nav>
    `;

    return breadcrumbHtml;
  }

  /**
   * 페이지 렌더링
   */
  render() {
    const loadingIndicatorHtml = this.getLoadingIndicatorHtml();

    const headerTitle = document.getElementById("header-title");
    headerTitle.textContent = "상품 상세";

    return /*html*/ `
      ${loadingIndicatorHtml}
    `;
  }
}

export default ProductDetailPage;
