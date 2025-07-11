import { getProducts } from "../../api/productApi";
import { DEFAULT_PAGE } from "../../constants.js";
import { useNavigate } from "../../hook/useRouter.js";
import Component from "../../lib/Component";
import { homeStore, PRODUCT_LIST_MODE } from "../../store/homeStore";
import getFilter from "../../utils/getFilter.js";
import ProductItem from "./ProductItem";

const INFINITE_SCROLL_THRESHOLD = 10;

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
      const currentParams = {
        page: currentState.products.pagination.page,
        limit,
        search,
        category1,
        category2,
        sort,
      };

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
    // 페이지를 1로 리셋하고 상품 목록 재조회
    homeStore.setState({
      products: {
        pagination: {
          ...homeStore.getState().products.pagination,
          page: DEFAULT_PAGE,
        },
      },
    });
  }

  setEvent() {
    this.$target.querySelectorAll(".product-card img").forEach((img) => {
      img.addEventListener("click", this.handleProductClick);
    });
    this.handleAddToCart();

    window.addEventListener("queryParamsChange", this.handleQueryParamsChange);
    window.addEventListener("scroll", this.throttledScrollHandler);
  }

  cleanup() {
    this.$target.querySelectorAll(".product-card img").forEach((img) => {
      img.removeEventListener("click", this.handleProductClick);
    });

    // 쿼리 파라미터 변경 이벤트 리스너 제거
    window.removeEventListener("queryParamsChange", this.handleQueryParamsChange);
    window.removeEventListener("scroll", this.throttledScrollHandler);

    // 상태 구독 해제
    if (this.unsubscribe) this.unsubscribe();
  }

  shouldFetchInitialProducts(currentParams) {
    // 첫 번째 로드인 경우
    if (!this.prevFilterState) {
      return true;
    }

    // 필터 조건이 변경된 경우
    const paramKeys = ["page", "search", "category1", "category2", "sort", "limit"];
    return paramKeys.some((key) => this.prevFilterState[key] !== currentParams[key]);
  }

  handleProductClick(e) {
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
    const scrollPosition = {
      scrollTop: window.scrollY,
      timestamp: Date.now(),
    };
    sessionStorage.setItem("productListScrollPosition", JSON.stringify(scrollPosition));
  }

  // 스크롤 위치 복원
  restoreScrollPosition() {
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
    const homeState = homeStore.getState();
    const {
      isMoreProductsLoading,
      pagination: { page },
    } = homeState.products;
    const { limit, sort, search, category1, category2 } = getFilter();

    if (isMoreProductsLoading) return;

    try {
      homeStore.setState({
        products: {
          ...homeState.products,
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

      homeStore.setState({
        products: {
          ...homeStore.getState().products,
          isMoreProductsLoading: false,
          list: [...homeStore.getState().products.list, ...products],
          pagination: {
            ...pagination,
            page: page + 1,
          },
          productListMode: PRODUCT_LIST_MODE.INFINITE_SCROLL,
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

  // 컴포넌트 마운트 시 스크롤 위치 복원
  mounted() {
    // 스크롤 위치 복원
    setTimeout(() => {
      this.restoreScrollPosition();
    }, 100);
  }

  handleAddToCart() {
    const { cart, products } = homeStore.getState();

    const $cartButton = document.querySelectorAll(".add-to-cart-btn");
    if (!$cartButton.length) return;

    $cartButton.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const productId = e.target.dataset.productId;
        const product = products.list.find((product) => product.productId === productId);
        const isExist = cart.items.some((item) => item.productId === productId);

        if (isExist) return;

        homeStore.setState({
          cart: {
            items: [...cart.items, { ...product, quantity: 1 }],
          },
        });
      });
    });
  }

  // DOM에 직접 상품 추가
  appendProductsToDOM(products) {
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

    // 새로 추가된 상품들에 이벤트 리스너 추가
    this.setEvent();
  }

  loadingTemplate() {
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
    const {
      products: { list, total, isProductsLoading, isMoreProductsLoading, pagination },
    } = homeStore.getState();

    if (isProductsLoading) {
      return this.loadingTemplate();
    }

    const { page, limit } = pagination;
    const maxPage = Math.ceil(total / limit);
    const hasMoreProducts = page < maxPage;

    return /* HTML */ ` <div>
      <!-- 상품 개수 정보 -->
      <div class="mb-4 text-sm text-gray-600">
        총 <span class="font-medium text-gray-900">${total}개</span>의 상품
      </div>
      <!-- 상품 그리드 -->
      <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
        ${list.map(ProductItem).join("")}
      </div>

      <!-- 무한스크롤 로딩 상태 -->
      ${isMoreProductsLoading
        ? `<div class="grid grid-cols-2 gap-4 mb-6">
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
        </div>`
        : ""}

      <!-- 완료 메시지 -->
      ${!hasMoreProducts
        ? `<div class="text-center py-4 text-sm text-gray-500">모든 상품을 확인했습니다</div>`
        : ""}
    </div>`;
  }
}
