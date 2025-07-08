import stateManager from "../state/index.js";
import { getProducts } from "../api/productApi.js";
import ProductItem from "../components/ProductItem.js";
import SearchBox from "../components/SearchBox/index.js";

class ProductListPage {
  constructor() {
    this.productItems = [];
    this.currentPage = 1;
    this.hasMore = true;
    this.isLoadingMore = false; // 무한 스크롤 로딩 중 플래그
    this.scrollTimer = null; // 스크롤 디바운싱용 타이머

    // SearchBox 인스턴스 생성
    this.searchBox = new SearchBox();
  }

  /**
   * 상태 구독 설정 (#2)
   */
  setupSubscriptions() {
    // 검색 필터 변경 시 상품 목록 다시 로드
    stateManager.product.subscribe(["searchQuery", "category", "sort", "pageSize"], () => {
      this.handleFilterChange();
    });

    // 상품 목록 상태 구독
    stateManager.product.subscribe("products", (products) => {
      this.renderProducts(products);
    });

    // 총 상품 수 구독
    stateManager.product.subscribe("totalProducts", (totalProducts) => {
      this.renderProductCount(totalProducts);
    });

    // 로딩 상태 구독
    stateManager.product.subscribe("loading", (loading) => {
      this.renderLoadingState(loading);
    });

    // 에러 상태 구독
    stateManager.product.subscribe("error", (error) => {
      if (error) {
        stateManager.ui.showToast(error, "error");
      }
    });
  }

  /**
   * 컴포넌트가 DOM에 마운트된 후 호출 (#3 - router.js에서 호출)
   */
  async mounted() {
    // 스크롤 이벤트 리스너 추가
    window.addEventListener("scroll", this.handleScroll);

    // SearchBox 이벤트 연결
    this.searchBox.attachEvents();

    // 상태 구독 설정
    this.setupSubscriptions();

    // 현재 상태 확인
    const currentState = stateManager.product.state;
    const hasExistingData = currentState.products.length > 0;

    if (hasExistingData) {
      // 기존 데이터가 있으면 그대로 사용
      this.renderProductCount(currentState.totalProducts);
      // 무한 스크롤을 위한 페이지 상태 계산
      this.currentPage = Math.ceil(currentState.products.length / currentState.pageSize) + 1;
      this.hasMore = currentState.products.length < currentState.totalProducts;
    } else {
      // 데이터가 없으면 새로 로드
      this.renderProductCount(null);
      await this.loadInitialProducts();
    }
  }

  /**
   * 컴포넌트가 언마운트될 때 정리
   */
  unmounted() {
    // 스크롤 이벤트 리스너 제거
    window.removeEventListener("scroll", this.handleScroll);

    // 스크롤 타이머 정리
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
      this.scrollTimer = null;
    }

    // 상태 구독 해제
    if (stateManager.product && stateManager.product.unsubscribeAll) {
      stateManager.product.unsubscribeAll();
    }

    // SearchBox 이벤트 정리 (있을 경우)
    if (this.searchBox && this.searchBox.unmounted) {
      this.searchBox.unmounted();
    }

    // 상태 플래그 초기화
    this.isLoadingMore = false;
    this.hasMore = true;
  }

  /**
   * 초기 상품 목록을 로드 (#4)
   */
  async loadInitialProducts() {
    // 초기 로드 시 상품 목록 초기화
    stateManager.product.setProducts([], 0);

    await this.loadProducts(true);
  }

  /**
   * 상품 목록 로드 (#5)
   */
  async loadProducts(reset = false) {
    // 중복 요청 방지
    if (!reset && (this.isLoadingMore || stateManager.product.state.loading)) {
      return;
    }

    // 무한 스크롤이고 더 이상 데이터가 없으면 중지
    if (!reset && !this.hasMore) {
      return;
    }

    const state = stateManager.product.state;

    // 로딩 플래그 설정
    if (!reset) {
      this.isLoadingMore = true;
    }

    // 로딩 상태 시작
    stateManager.product.setLoading(true);
    stateManager.product.setError(null);

    try {
      // 카테고리를 category1, category2로 분리
      let category1 = "";
      let category2 = "";
      if (state.category) {
        const parts = state.category.split("|");
        category1 = parts[0] || "";
        category2 = parts[1] || "";
      }

      // 상품 목록 로드 param 설정
      const pageToLoad = reset ? 1 : this.currentPage;
      const params = {
        page: pageToLoad,
        limit: state.pageSize,
        search: state.searchQuery,
        category1,
        category2,
        sort: state.sort,
      };

      // 상품 목록 로드
      const response = await getProducts(params);

      if (reset) {
        // 새로운 검색이나 필터 변경 시 기존 목록 대체
        stateManager.product.setProducts(response.products, response.pagination.total);
        this.currentPage = 2; // 다음에 로드할 페이지는 2번
      } else {
        // 무한 스크롤 시 기존 목록에 추가
        const currentProducts = stateManager.product.state.products;
        const newProducts = [...currentProducts, ...response.products];
        stateManager.product.setProducts(newProducts, response.pagination.total);
        this.currentPage++; // 다음 페이지 번호 증가
      }

      // hasMore 상태 업데이트
      this.hasMore = response.pagination.hasNext;
    } catch (error) {
      stateManager.product.setError(error.message);
    } finally {
      stateManager.product.setLoading(false);
      this.isLoadingMore = false; // 로딩 플래그 해제
    }
  }

  /**
   * 무한 스크롤 처리 (디바운싱 적용)
   */
  handleScroll = () => {
    // 이미 로딩 중이거나 더 이상 페이지가 없으면 중지
    if (this.isLoadingMore || stateManager.product.state.loading || !this.hasMore) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // 페이지 하단 근처에 도달했는지 확인
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      this.loadProducts(false);
    }
  };

  /**
   * 검색어, 카테고리, 정렬, 페이지 수 변경 시 상품 목록 다시 로드
   */
  handleFilterChange() {
    // 새로운 검색/필터시에는 페이지 상태 초기화
    this.currentPage = 1;
    this.hasMore = true;
    this.isLoadingMore = false; // 무한 스크롤 플래그도 초기화
    this.loadProducts(true);
  }

  /**
   * 상품 목록 렌더링 (#6-1 - products 상태 변경 시 호출)
   */
  renderProducts(products) {
    const productsGrid = document.getElementById("products-grid");
    if (!productsGrid) return;

    // 기존 상품 목록 초기화
    this.productItems = [];

    // 상품이 없을 경우
    if (products.length === 0 && !stateManager.product.state.loading) {
      productsGrid.innerHTML = /*html*/ `
        <div class="col-span-2 text-center py-8 text-gray-500">
          검색 결과가 없습니다.
        </div>
      `;
      return;
    }

    // 상품 아이템들 렌더링
    const productItemsHtml = products
      .map((product) => {
        const productItem = new ProductItem(product);
        this.productItems.push(productItem);
        return productItem.render();
      })
      .join("");

    productsGrid.innerHTML = productItemsHtml;

    // DOM에 추가된 후 각 ProductItem의 이벤트 연결
    this.productItems.forEach((productItem) => {
      productItem.mounted();
    });
  }

  /**
   * 총 상품 수 렌더링 (#6-2 - products 상태 변경 시 호출)
   */
  renderProductCount(totalProducts) {
    const productCount = document.querySelector(".product-count");
    if (productCount) {
      // 상품 데이터가 로드되었을 때만 표시 (0개 포함)
      if (totalProducts !== undefined && totalProducts !== null) {
        productCount.textContent = `총 ${totalProducts}개의 상품`;
      } else {
        // 데이터 로드 전에는 0개로 표시
        productCount.textContent = "총 0개의 상품";
      }
    }
  }

  /**
   * 로딩 상태 렌더링 (#6-3 - products 상태 변경 시 호출)
   */
  renderLoadingState(loading) {
    const loadingIndicator = document.querySelector(".loading-indicator");

    if (loadingIndicator) {
      if (loading && this.currentPage > 1) {
        // 무한 스크롤 로딩
        loadingIndicator.style.display = "block";
      } else {
        loadingIndicator.style.display = "none";
      }
    }
  }

  render() {
    const searchBoxHtml = this.searchBox.render();

    return /*html*/ `
      <div class="min-h-screen bg-gray-50 pb-6">
        <!-- 검색 및 필터 -->
        <div class="container mx-auto px-4 pt-4">
          ${searchBoxHtml}
        </div>

        <!-- 상품 목록 영역 -->
        <div class="container mx-auto px-4">
          <!-- 상품 개수 정보 -->
          <div class="product-count mb-4 text-sm text-gray-600">
            
          </div>
          
          <!-- 상품 그리드 -->
          <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
            <!-- 초기 로딩 스켈레톤 -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div class="aspect-square bg-gray-200"></div>
              <div class="p-3">
                <div class="h-4 bg-gray-200 rounded mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div class="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div class="aspect-square bg-gray-200"></div>
              <div class="p-3">
                <div class="h-4 bg-gray-200 rounded mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div class="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div class="aspect-square bg-gray-200"></div>
              <div class="p-3">
                <div class="h-4 bg-gray-200 rounded mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div class="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div class="aspect-square bg-gray-200"></div>
              <div class="p-3">
                <div class="h-4 bg-gray-200 rounded mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div class="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          
          <!-- 무한 스크롤 로딩 인디케이터 -->
          <div class="loading-indicator text-center py-4" style="display: none;">
            <div class="inline-flex items-center">
              <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

export default ProductListPage;
