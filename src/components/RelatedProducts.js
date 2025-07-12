import stateManager from "../state/index.js";
import { getProducts } from "../api/productApi.js";

class RelatedProducts {
  constructor(product) {
    this.product = product;
    this.maxSize = 19;
  }

  /**
   * 페이지 초기화 및 상품 로딩 시작
   */
  mounted() {
    // 상태 구독
    this.setupSubscriptions();

    // 관련 상품 로드
    this.loadRelatedProducts();
  }

  /**
   * 컴포넌트가 언마운트될 때 정리
   */
  unmounted() {
    // 이벤트 해제
    this.detachEvents();
  }

  // =============== 상태 구독 메서드 ===============
  /**
   * 상태 구독 설정
   */
  setupSubscriptions() {
    // 관련 상품 로딩 상태 구독
    stateManager.productDetail.subscribe(["relatedProductsLoading"], () => {
      this.renderLoading();
    });

    // 관련 상품 데이터 구독
    stateManager.productDetail.subscribe(["relatedProducts"], () => {
      this.renderRelatedProducts();
    });

    // 관련 상품 에러 구독
    stateManager.productDetail.subscribe(["relatedProductsError"], () => {
      this.renderError();
    });
  }

  /**
   * 관련 상품 로딩 상태 설정
   * @param {boolean} loading - 로딩 상태
   */
  setRelatedProductsLoading(loading) {
    stateManager.productDetail.setState({
      relatedProductsLoading: loading,
    });
  }

  /**
   * 관련 상품 데이터 설정
   * @param {Array} products - 관련 상품 데이터
   */
  setRelatedProducts(products) {
    stateManager.productDetail.setState({
      relatedProducts: products,
    });
  }

  /**
   * 관련 상품 에러 설정
   * @param {string} error - 에러 메시지
   */
  setRelatedProductsError(error) {
    stateManager.productDetail.setState({
      relatedProductsError: error,
    });
  }

  // =============== 관련 상품 로드 메서드 ===============
  /**
   * 관련 상품 데이터를 로드합니다.
   */
  async loadRelatedProducts() {
    this.setRelatedProductsLoading(true);

    try {
      const currentProduct = this.product;

      // 현재 상품의 카테고리 정보 추출
      const category1 = currentProduct.category1;
      const category2 = currentProduct.category2;

      // 같은 카테고리의 상품들을 검색
      const searchParams = {
        limit: this.maxSize + 5, // 현재 상품 제외를 위해 여유분 요청
        ...(category1 && { category1 }),
        ...(category2 && { category2 }),
        sort: "price_asc",
      };

      const response = await getProducts(searchParams);

      // 현재 상품 제외하고 지정된 개수만큼만 선택
      this.setRelatedProducts(
        response.products.filter((product) => product.productId !== currentProduct.productId).slice(0, this.maxSize),
      );
    } catch (error) {
      console.error("관련 상품 로드 실패:", error);
      this.setRelatedProductsError(error.message);
    } finally {
      this.setRelatedProductsLoading(false);
    }
  }

  // =============== 이벤트 처리 메서드 ===============
  /**
   * 상품 클릭 이벤트 처리
   */
  handleProductClick = () => {
    const productCards = document.querySelectorAll("[data-product-id]");

    if (!productCards) return;

    productCards.forEach((productCard) => {
      productCard.addEventListener("click", () => {
        window.history.pushState({}, "", `/product/${productCard.dataset.productId}`);
        window.dispatchEvent(new Event("popstate"));
      });
    });
  };

  /**
   * 이벤트 리스너를 연결합니다.
   */
  attachEvents() {}

  /**
   * 이벤트 리스너를 해제합니다.
   */
  detachEvents() {}

  // =============== 렌더링 메서드 ===============
  /**
   * 관련 상품 로딩 렌더링
   */
  renderLoading() {
    const container = document.getElementById("related-products-grid");
    const loading = stateManager.productDetail.state.relatedProductsLoading;

    if (!container || !loading) return;

    container.innerHTML = /*html*/ `
      <div class="p-4">
        <div class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p class="text-sm text-gray-600">관련 상품을 불러오는 중...</p>
        </div>
      </div>
    `;
  }

  /**
   * 관련 상품 렌더링
   */
  renderRelatedProducts() {
    const container = document.getElementById("related-products-grid");
    const products = stateManager.productDetail.state.relatedProducts;

    if (!container || !products) return;

    container.innerHTML = /*html*/ `
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-lg font-bold text-gray-900">관련 상품</h2>
        <p class="text-sm text-gray-600">같은 카테고리의 다른 상품들</p>
      </div>
      <div class="p-4">
        <div class="grid grid-cols-2 gap-3 responsive-grid">
          ${products
            .map((product) => {
              const formattedPrice = parseInt(product.lprice).toLocaleString();
              return /*html*/ `
              <div class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer" 
                    data-product-id="${product.productId}">
                <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
                  <img src="${product.image}" 
                        alt="${product.title}" 
                        class="w-full h-full object-cover" 
                        loading="lazy">
                </div>
                <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                  ${product.title}
                </h3>
                <p class="text-sm font-bold text-blue-600">
                  ${formattedPrice}원
                </p>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    `;

    // 이벤트 연결
    this.handleProductClick();
  }

  /**
   * 관련 상품 에러 렌더링
   */
  renderError() {
    const container = document.getElementById("related-products-grid");
    const error = stateManager.productDetail.state.relatedProductsError;

    if (!container || !error) return;

    container.innerHTML = /*html*/ `
      <div class="p-4">
        <div class="text-center py-8">
          <p class="text-sm text-gray-500">관련 상품을 불러올 수 없습니다.</p>
        </div>
      </div>
    `;
  }

  /**
   * 컴포넌트를 렌더링합니다.
   * @returns {string} HTML 문자열
   */
  render() {
    return /*html*/ `
      <div id="related-products-grid" class="bg-white rounded-lg shadow-sm">
        <div class="p-4">
          <div class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p class="text-sm text-gray-600">관련 상품을 불러오는 중...</p>
          </div>
        </div>
      </div>
    `;
  }
}

export default RelatedProducts;
