import { getProducts } from "../../api/productApi";
import { DEFAULT_PAGE } from "../../constants.js";
import { useNavigate } from "../../hook/useRouter.js";
import Component from "../../lib/Component";
import { homeStore, PRODUCT_LIST_MODE } from "../../store/homeStore";
import getFilter from "../../utils/getFilter.js";
import ProductItem from "./ProductItem";
import Loading from "../common/Loading";

const INFINITE_SCROLL_THRESHOLD = 1;

// 스크롤 이벤트 최적화를 위한 throttle 함수
const throttle = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(
        () => {
          func.apply(this, args);
          lastExecTime = Date.now();
        },
        delay - (currentTime - lastExecTime),
      );
    }
  };
};

export default class ProductList extends Component {
  setup() {
    console.log("setup");
    this.prevFilterState = null;

    // throttle 적용된 스크롤 핸들러
    this.throttledScrollHandler = throttle(this.handleInfiniteScroll.bind(this), 100);

    // 스크롤 위치 복원
    this.restoreScrollPosition = this.restoreScrollPosition.bind(this);

    // ! 이벤트 핸들러를 미리 바인딩해서 보관
    // ! this.handleClick이 항상 같은 함수 객체가 되도록
    // * bind : 클래스 메서드는 this가 동적으로 결정, handleProductClick는 함수이고 호출 시 객체 인스턴스와 연결되어있지 않음
    this.handleProductClick = this.handleProductClick.bind(this);
    this.handleQueryParamsChange = this.handleQueryParamsChange.bind(this);

    this.unsubscribe = homeStore.subscribe(() => {
      console.log("homeState changed");

      const { limit, sort, search, category1, category2 } = getFilter();

      const currentState = homeStore.getState();
      const { productListMode } = currentState.products;
      const currentParams = {
        page: currentState.products.pagination.page,
        limit,
        search,
        category1,
        category2,
        sort,
      };

      // 무한스크롤 모드일 때는 부분 업데이트만 수행
      if (productListMode === PRODUCT_LIST_MODE.INFINITE_SCROLL) {
        console.log("무한스크롤 모드: 부분 업데이트만 수행");
        this.updateInfiniteScrollUI();
        this.prevFilterState = currentParams;
        return;
      }

      if (this.shouldFetchInitialProducts(currentParams)) {
        this.fetchInitialProducts();
      }

      this.render();
      this.setEvent();
      this.mounted();

      this.prevFilterState = currentParams;
    });
  }

  // 쿼리 파라미터 변경 이벤트 핸들러
  handleQueryParamsChange() {
    console.log("handleQueryParamsChange");
    // 페이지를 1로 리셋하고 무한스크롤 모드 해제
    homeStore.setState({
      products: {
        ...homeStore.getState().products,
        pagination: {
          ...homeStore.getState().products.pagination,
          page: DEFAULT_PAGE,
        },
        productListMode: PRODUCT_LIST_MODE.INITIAL,
      },
    });
  }

  setEvent() {
    console.log("setEvent");
    // 새로운 상품들에만 이벤트 추가
    this.addEventListenersToNewProducts();

    window.addEventListener("queryParamsChange", this.handleQueryParamsChange);
    window.addEventListener("scroll", this.throttledScrollHandler);
  }

  cleanup() {
    console.log("cleanup");
    // 무한스크롤 관련 동적 요소들 제거
    const $loadingSection = document.querySelector("#infinite-scroll-loading");
    const $completionMessage = document.querySelector("#infinite-scroll-completion");
    if ($loadingSection) $loadingSection.remove();
    if ($completionMessage) $completionMessage.remove();

    // 쿼리 파라미터 변경 이벤트 리스너 제거
    window.removeEventListener("queryParamsChange", this.handleQueryParamsChange);
    window.removeEventListener("scroll", this.throttledScrollHandler);

    // 상태 구독 해제
    if (this.unsubscribe) this.unsubscribe();
  }

  shouldFetchInitialProducts(currentParams) {
    console.log("shouldFetchInitialProducts");
    // 첫 번째 로드인 경우
    if (!this.prevFilterState) {
      return true;
    }

    // 무한스크롤 모드인 경우 초기 상품 로딩 방지
    const { productListMode } = homeStore.getState().products;
    if (productListMode === PRODUCT_LIST_MODE.INFINITE_SCROLL) {
      console.log("무한스크롤 모드: 초기 상품 로딩 건너뜀");
      return false;
    }

    // 필터 조건이 변경된 경우만 초기 상품 로딩
    const filterKeys = ["search", "category1", "category2", "sort", "limit"];
    return filterKeys.some((key) => this.prevFilterState[key] !== currentParams[key]);
  }

  handleProductClick(e) {
    console.log("handleProductClick");
    e.stopPropagation();

    const { navigate } = useNavigate();

    const productCard = e.target.closest(".product-card");
    if (productCard) {
      const productId = productCard.dataset.productId;
      // 스크롤 위치 저장
      this.saveScrollPosition();
      navigate(`/product/${productId}`);
    }
  }

  // 스크롤 위치 저장
  saveScrollPosition() {
    console.log("saveScrollPosition");
    const scrollPosition = {
      scrollTop: window.scrollY,
      timestamp: Date.now(),
    };
    sessionStorage.setItem("productListScrollPosition", JSON.stringify(scrollPosition));
  }

  // 스크롤 위치 복원
  restoreScrollPosition() {
    console.log("restoreScrollPosition");
    const savedPosition = sessionStorage.getItem("productListScrollPosition");
    if (savedPosition) {
      try {
        const { scrollTop, timestamp } = JSON.parse(savedPosition);
        // 30분 이내의 스크롤 위치만 복원
        if (Date.now() - timestamp < 30 * 60 * 1000) {
          window.scrollTo(0, scrollTop);
        }
        sessionStorage.removeItem("productListScrollPosition");
      } catch (error) {
        console.error("스크롤 위치 복원 실패:", error);
      }
    }
  }

  async fetchMoreProducts() {
    console.log("fetchMoreProducts");
    const homeState = homeStore.getState();
    const {
      isMoreProductsLoading,
      pagination: { page },
    } = homeState.products;
    const { limit, sort, search, category1, category2 } = getFilter();

    if (isMoreProductsLoading) return;

    try {
      // 먼저 무한스크롤 모드로 설정
      homeStore.setState({
        products: {
          ...homeState.products,
          productListMode: PRODUCT_LIST_MODE.INFINITE_SCROLL,
          isMoreProductsLoading: true,
        },
      });

      const params = {
        page: page + 1,
        limit,
        search,
        category1,
        category2,
        sort,
      };

      const { products, pagination } = await getProducts(params);

      // DOM에 새 상품들 추가
      this.appendProductsToDOM(products);

      homeStore.setState({
        products: {
          ...homeStore.getState().products,
          isMoreProductsLoading: false,
          list: [...homeStore.getState().products.list, ...products],
          pagination: {
            ...pagination,
            page: page + 1,
          },
        },
      });
    } catch (error) {
      console.error("상품 추가 로딩 실패:", error);
      homeStore.setState({
        products: {
          ...homeStore.getState().products,
          isMoreProductsLoading: false,
        },
      });
      throw error;
    }
  }

  async fetchInitialProducts() {
    console.log("fetchInitialProducts");
    const homeState = homeStore.getState();
    const { isProductsLoading } = homeState.products;
    const { limit, sort, search, category1, category2 } = getFilter();

    if (isProductsLoading) return;

    homeStore.setState({
      products: {
        ...homeState.products,
        isProductsLoading: true,
      },
    });

    const params = {
      page: DEFAULT_PAGE,
      limit,
      search,
      category1,
      category2,
      sort,
    };

    const { products, pagination } = await getProducts(params);

    homeStore.setState({
      products: {
        isProductsLoading: false,
        list: products,
        total: pagination.total,
        pagination,
      },
    });
  }

  async handleInfiniteScroll() {
    console.log("handleInfiniteScroll");
    const { isProductsLoading, isMoreProductsLoading, pagination } = homeStore.getState().products;

    // 로딩 중이면 중복 호출 방지
    if (isProductsLoading || isMoreProductsLoading) return;

    const scrollTop = window.scrollY;
    const scrollHeight = document.body.scrollHeight;
    const clientHeight = window.innerHeight;

    // 스크롤이 바닥에 도달했는지 확인 (더 정확한 계산)
    const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - INFINITE_SCROLL_THRESHOLD;

    if (scrolledToBottom) {
      // 다음 페이지가 있는지 확인
      const { page, total, limit } = pagination;
      const maxPage = Math.ceil(total / limit);

      if (page >= maxPage) return;

      try {
        // 추가 상품 불러오기
        await this.fetchMoreProducts();
      } catch (error) {
        console.error("무한스크롤 로딩 에러:", error);
        // 에러 발생 시 로딩 상태 해제
        homeStore.setState({
          products: {
            ...homeStore.getState().products,
            isMoreProductsLoading: false,
          },
        });
      }
    }
  }

  // 무한스크롤 전용 UI 업데이트
  updateInfiniteScrollUI() {
    console.log("updateInfiniteScrollUI");
    const { isMoreProductsLoading, pagination, total } = homeStore.getState().products;

    // 로딩 상태 업데이트
    console.log("updateInfiniteScrollUI isMoreProductsLoading:", isMoreProductsLoading);
    this.updateLoadingState(isMoreProductsLoading);

    // 완료 메시지 업데이트
    const { page, limit } = pagination;
    const maxPage = Math.ceil(total / limit);
    const hasMoreProducts = page < maxPage;
    this.updateCompletionMessage(!hasMoreProducts);

    // 새로 추가된 상품들에 이벤트 리스너 추가 (새 상품만)
    this.addEventListenersToNewProducts();
  }

  // 로딩 상태 UI 업데이트
  updateLoadingState(isLoading) {
    let $loadingSection = document.querySelector("#infinite-scroll-loading");

    if (isLoading && !$loadingSection) {
      // Loading 컴포넌트 추가
      const $productsGrid = document.querySelector("#products-grid");
      if ($productsGrid && $productsGrid.parentNode) {
        const $loadingDiv = document.createElement("div");
        $loadingDiv.id = "infinite-scroll-loading";
        $loadingDiv.className = "py-8 flex items-center justify-center";

        // 무한스크롤용 Loading 컴포넌트 (전체 화면을 덮지 않도록 수정)
        $loadingDiv.innerHTML = Loading("상품을 불러오는 중...");

        $productsGrid.parentNode.insertBefore($loadingDiv, $productsGrid.nextSibling);
      }
    } else if (!isLoading && $loadingSection) {
      // 로딩 컴포넌트 제거
      $loadingSection.remove();
    }
  }

  // 완료 메시지 업데이트
  updateCompletionMessage(showCompletion) {
    let $completionMessage = document.querySelector("#infinite-scroll-completion");

    if (showCompletion && !$completionMessage) {
      // 완료 메시지 추가
      const $container = this.$target;
      const $completionDiv = document.createElement("div");
      $completionDiv.id = "infinite-scroll-completion";
      $completionDiv.className = "text-center py-4 text-sm text-gray-500";
      $completionDiv.textContent = "모든 상품을 확인했습니다";
      $container.appendChild($completionDiv);
    } else if (!showCompletion && $completionMessage) {
      // 완료 메시지 제거
      $completionMessage.remove();
    }
  }

  // 새로 추가된 상품들에만 이벤트 리스너 추가
  addEventListenersToNewProducts() {
    const $newProducts = this.$target.querySelectorAll(".product-card:not([data-events-added])");

    $newProducts.forEach(($product) => {
      // 상품 클릭 이벤트
      const $img = $product.querySelector("img");
      if ($img) {
        $img.addEventListener("click", this.handleProductClick);
      }

      // 장바구니 버튼 이벤트
      const $cartBtn = $product.querySelector(".add-to-cart-btn");
      if ($cartBtn) {
        $cartBtn.addEventListener("click", (e) => {
          console.log("addToCartButtonClick");
          e.stopPropagation();
          const productId = e.target.dataset.productId;
          const { cart, products } = homeStore.getState();
          const product = products.list.find((product) => product.productId === productId);
          const isExist = cart.items.some((item) => item.productId === productId);

          if (isExist) return;

          homeStore.setState({
            cart: {
              items: [...cart.items, { ...product, quantity: 1 }],
            },
          });
        });
      }

      // 이벤트 추가 완료 표시
      $product.setAttribute("data-events-added", "true");
    });
  }

  // 컴포넌트 마운트 시 스크롤 위치 복원
  mounted() {
    console.log("mounted");
    // 스크롤 위치 복원
    setTimeout(() => {
      this.restoreScrollPosition();
    }, 100);
  }

  // DOM에 직접 상품 추가
  appendProductsToDOM(products) {
    console.log("appendProductsToDOM");
    const $productsGrid = document.querySelector("#products-grid");
    if (!$productsGrid) return;

    products.forEach((product) => {
      const productHTML = ProductItem(product);
      const $productElement = document.createElement("div");
      $productElement.innerHTML = productHTML;

      // 첫 번째 자식 요소 (실제 상품 카드)를 추가
      const $productCard = $productElement.firstElementChild;
      if ($productCard) {
        $productsGrid.appendChild($productCard);
      }
    });

    // 새로 추가된 상품들에만 이벤트 리스너 추가
    this.addEventListenersToNewProducts();
  }

  loadingTemplate() {
    console.log("loadingTemplate");
    return /* HTML */ ` <div class="grid grid-cols-2 gap-4">
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"
      >
        <div class="aspect-square bg-gray-200"></div>
        <div class="p-3">
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div class="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"
      >
        <div class="aspect-square bg-gray-200"></div>
        <div class="p-3">
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div class="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"
      >
        <div class="aspect-square bg-gray-200"></div>
        <div class="p-3">
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div class="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"
      >
        <div class="aspect-square bg-gray-200"></div>
        <div class="p-3">
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div class="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>`;
  }

  template() {
    console.log("template");
    const {
      products: { list, total, isProductsLoading },
    } = homeStore.getState();

    if (isProductsLoading) {
      return this.loadingTemplate();
    }

    return /* HTML */ ` <div>
      <!-- 상품 개수 정보 -->
      <div class="mb-4 text-sm text-gray-600">
        총 <span class="font-medium text-gray-900">${total}개</span>의 상품
      </div>
      <!-- 상품 그리드 -->
      <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
        ${list.map(ProductItem).join("")}
      </div>
    </div>`;
  }
}
