import { getCategories, getProducts } from "./api/productApi.js";
import { HomePage } from "./pages/HomePage.js";
import { ProductDetailPage } from "./pages/ProductDetailPage.js";
import { showCartModal, renderCartModal } from "./handlers/cart.js";
import { router } from "./router.js";

// URL 쿼리 스트링 관리 함수들
function updateUrlParams(params) {
  const url = new URL(window.location);

  // 기존 파라미터들 제거 (상품 관련)
  const keysToRemove = ["limit", "page", "sort", "search", "category1", "category2"];
  keysToRemove.forEach((key) => url.searchParams.delete(key));

  // 새로운 파라미터들 추가 (값이 있는 경우만)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  // URL 업데이트 (페이지 새로고침 없이)
  window.history.pushState({}, "", url.toString());
}

function getSearchFromUrl() {
  const path = window.location.pathname;
  const searchMatch = path.match(/^\/search=(.+)$/);
  if (searchMatch) {
    return decodeURIComponent(searchMatch[1]);
  }
  return "";
}

function syncStateWithUrl() {
  // path에서 검색어 추출
  const searchTerm = getSearchFromUrl();
  if (searchTerm) {
    state.search = searchTerm;
  } else if (window.location.pathname === "/") {
    // 홈페이지면 검색어 초기화
    state.search = "";
  }
}

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

export let state = {
  products: [],
  total: 0,
  loading: false,
  categories: {},
  productCount: 20,
  page: 1,
  hasNext: false,
  hasPrev: false,
  sort: "price_asc",
  cart: [],
  selectedCartItems: [], // 선택된 장바구니 아이템 ID들
  search: "",
  selectedCategory1: null,
  selectedCategory2: null,
};

function render() {
  document.body.querySelector("#root").innerHTML = HomePage(state);
  setupInfiniteScroll();
}

function renderProductDetail(productId) {
  const product = state.products.find((p) => p.productId === productId);

  if (!product) {
    // 상품을 찾을 수 없으면 API에서 가져오기 시도
    console.warn("Product not found in state, redirecting to home");
    router.navigate("/");
    return;
  }

  // 관련 상품 (같은 카테고리의 다른 상품들)
  const relatedProducts = state.products.filter((p) => p.productId !== productId).slice(0, 4);

  document.body.querySelector("#root").innerHTML = ProductDetailPage({
    product,
    cart: state.cart,
    relatedProducts,
  });
}

async function main() {
  // URL에서 초기 상태 동기화 (테스트 환경이 아닌 경우에만)
  if (import.meta.env.MODE !== "test") {
    syncStateWithUrl();
  }

  // 초기값 - 로딩 상태 렌더링
  state.loading = true;

  // 라우터 설정을 먼저 해야 테스트에서 라우팅이 작동함
  setupRouter();
  render();

  // data fetch
  const [
    {
      products,
      pagination: { page, total, hasNext, hasPrev },
    },
    categories,
  ] = await Promise.all([
    getProducts({
      limit: state.productCount,
      sort: state.sort,
      search: state.search,
      category1: state.selectedCategory1,
      category2: state.selectedCategory2,
      page: state.page,
    }),
    getCategories(),
  ]);

  state.total = total;
  state.products = products;
  state.categories = categories;
  state.page = page;
  state.hasNext = hasNext;
  state.hasPrev = hasPrev;

  // 값 가져왔으니 로딩 상태 해제
  state.loading = false;

  // 현재 URL에 따라 적절한 페이지 렌더링
  router.handleRouteChange(location.pathname, false);
}

function setupRouter() {
  // 홈 페이지 라우트
  router.addRoute("/", () => {
    // 데이터가 이미 로드된 경우 로딩 상태를 false로 설정
    if (state.products.length > 0) {
      state.loading = false;
    }
    render();
  });

  // 검색 페이지 라우트
  router.addRoute("/search=:searchTerm", (params) => {
    const searchTerm = decodeURIComponent(params.searchTerm);
    handleSearchFromUrl(searchTerm);
  });

  // 상품 상세 페이지 라우트
  router.addRoute("/product/:productId", (params) => {
    renderProductDetail(params.productId);
  });
}

function setupEventListeners() {
  document.addEventListener("change", async (event) => {
    if (event.target.matches("#limit-select")) {
      handleLimitChange(Number(event.target.value));
    }
    if (event.target.matches("#sort-select")) {
      handleSortChange(event.target.value);
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.matches(".add-to-cart-btn")) {
      const productId = event.target.dataset.productId;

      // 상품 상세 페이지에서는 수량 고려
      const quantityInput = document.querySelector("#quantity-input");
      const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

      addToCart(productId, quantity);
      showToast({ type: "add" });
    }

    if (event.target.matches(".category1-filter-btn")) {
      const category1 = event.target.dataset.category1;
      handleCategory1Filter(category1);
    }

    if (event.target.matches(".category2-filter-btn")) {
      const category2 = event.target.dataset.category2;
      handleCategory2Filter(category2);
    }

    if (event.target.matches(".category-reset-btn")) {
      handleCategoryReset();
    }

    const cartButton = document.querySelector("#cart-icon-btn");
    if (cartButton && (event.target === cartButton || cartButton.contains(event.target))) {
      showCartModal(state, { renderCartModal, showToast });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.matches("#search-input")) {
      const searchValue = event.target.value;
      handleSearch(searchValue);
    }
  });
}

function navigateToProductDetail(productId) {
  router.navigate(`/product/${productId}`);
}

function setupProductDetailEventListeners() {
  document.addEventListener("click", (event) => {
    // 장바구니 버튼 클릭은 무시
    if (event.target.matches(".add-to-cart-btn") || event.target.closest(".add-to-cart-btn")) {
      return;
    }

    if (event.target.matches("#add-to-cart-btn")) {
      const productId = event.target.dataset.productId;

      // 상품 상세 페이지에서는 수량 고려
      const quantityInput = document.querySelector("#quantity-input");
      const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

      addToCart(productId, quantity);
      showToast({ type: "add" });
      return;
    }

    // product-card나 그 자식 요소 클릭 시 (홈페이지에서)
    const productCard = event.target.closest(".product-card");
    if (productCard) {
      const productId = productCard.dataset.productId;
      navigateToProductDetail(productId);
      return;
    }

    // 관련 상품 클릭 시 (상품 상세 페이지에서)
    const relatedProductCard = event.target.closest(".related-product-card");
    if (relatedProductCard) {
      const productId = relatedProductCard.dataset.productId;
      navigateToProductDetail(productId);
      return;
    }

    // 홈으로 돌아가기 버튼
    if (event.target.matches(".breadcrumb-home") || event.target.matches(".go-to-product-list")) {
      router.navigate("/");
      return;
    }

    // 수량 조절 버튼 (상품 상세 페이지)
    if (event.target.matches("#quantity-decrease") || event.target.closest("#quantity-decrease")) {
      const quantityInput = document.querySelector("#quantity-input");
      if (quantityInput) {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
        }
      }
      return;
    }

    if (event.target.matches("#quantity-increase") || event.target.closest("#quantity-increase")) {
      const quantityInput = document.querySelector("#quantity-input");
      if (quantityInput) {
        const currentValue = parseInt(quantityInput.value);
        const maxValue = parseInt(quantityInput.max) || 100;
        if (currentValue < maxValue) {
          quantityInput.value = currentValue + 1;
        }
      }
      return;
    }
  });
}

async function handleCategory1Filter(category1) {
  state.selectedCategory1 = category1;
  state.selectedCategory2 = null; // category1 변경 시 category2 리셋
  state.page = 1; // 카테고리 변경 시 첫 페이지로 리셋

  const categoryDetail = state.categories[category1];
  state.categories = categoryDetail;

  // 새로운 카테고리로 상품 데이터 재조회
  state.loading = true;
  const { products, pagination } = await getProducts({
    limit: state.productCount,
    sort: state.sort,
    search: state.search,
    category1: state.selectedCategory1,
    category2: state.selectedCategory2,
    page: state.page,
  });

  state.products = products;
  state.page = pagination.page;
  state.hasNext = pagination.hasNext;
  state.hasPrev = pagination.hasPrev;
  state.loading = false;
  state.total = pagination.total;

  render();
}

async function handleCategory2Filter(category2) {
  state.selectedCategory2 = category2;
  state.page = 1; // 카테고리 변경 시 첫 페이지로 리셋

  // URL 업데이트
  updateUrlParams({
    limit: state.productCount,
    page: state.page,
    sort: state.sort,
    search: state.search,
    category1: state.selectedCategory1,
    category2: state.selectedCategory2,
  });

  state.loading = true;
  const {
    products,
    pagination: { total, page, hasNext, hasPrev },
  } = await getProducts({
    limit: state.productCount,
    sort: state.sort,
    search: state.search,
    category1: state.selectedCategory1,
    category2: category2,
    page: state.page,
  });

  state.products = products;
  state.total = total;
  state.page = page;
  state.hasNext = hasNext;
  state.hasPrev = hasPrev;
  state.loading = false;

  render();
}

async function handleCategoryReset() {
  state.selectedCategory1 = null;
  state.selectedCategory2 = null;
  state.page = 1; // 카테고리 리셋 시 첫 페이지로

  // 전체 카테고리 다시 로드
  state.loading = true;
  const [{ products, pagination }, categories] = await Promise.all([
    getProducts({
      limit: state.productCount,
      sort: state.sort,
      search: state.search,
      page: state.page,
    }),
    getCategories(),
  ]);

  state.products = products;
  state.categories = categories;
  state.page = pagination.page;
  state.hasNext = pagination.hasNext;
  state.hasPrev = pagination.hasPrev;
  state.total = pagination.total;
  state.loading = false;

  render();
}

async function handleSearch(searchValue) {
  state.search = searchValue;
  state.page = 1; // 검색 시 첫 페이지로 리셋

  // URL 업데이트
  updateUrlParams({
    limit: state.productCount,
    page: state.page,
    sort: state.sort,
    search: state.search,
    category1: state.selectedCategory1,
    category2: state.selectedCategory2,
  });

  state.loading = true;
  const { products, pagination } = await getProducts({
    limit: state.productCount,
    sort: state.sort,
    search: state.search,
    category1: state.selectedCategory1,
    category2: state.selectedCategory2,
    page: state.page,
  });

  state.products = products;
  state.page = pagination.page;
  state.hasNext = pagination.hasNext;
  state.hasPrev = pagination.hasPrev;
  state.loading = false;
  state.total = pagination.total;

  render();
}

async function handleSearchFromUrl(searchTerm) {
  state.search = searchTerm;
  state.page = 1; // 검색 시 첫 페이지로 리셋

  state.loading = true;
  render();

  const { products, pagination } = await getProducts({
    limit: state.productCount,
    sort: state.sort,
    search: state.search,
    page: state.page,
  });

  state.products = products;
  state.page = pagination.page;
  state.hasNext = pagination.hasNext;
  state.hasPrev = pagination.hasPrev;
  state.loading = false;
  state.total = pagination.total;

  render();
}

function addToCart(productId, quantity = 1) {
  const product = state.products.find((p) => p.productId === productId);

  if (product) {
    // 수량만큼 장바구니에 추가
    for (let i = 0; i < quantity; i++) {
      state.cart.push(product);
    }
  }

  // 현재 페이지가 상품 상세 페이지라면 해당 페이지 다시 렌더링
  const currentPath = router.getCurrentPath();
  if (currentPath.startsWith("/product/")) {
    router.handleRouteChange(currentPath, false);
  } else {
    render();
  }
}

export function showToast({ type = "add" }) {
  const config = {
    add: {
      bg: "bg-green-600",
      message: "장바구니에 추가되었습니다",
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>',
    },
    delete: {
      bg: "bg-blue-600",
      message: "선택한 상품들이 삭제되었습니다",
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    },
    error: {
      bg: "bg-red-600",
      message: "오류가 발생했습니다.",
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>',
    },
  };

  const { bg, message: toastMessage, icon } = config[type];

  // 토스트 HTML 생성
  const toastHTML = `
    <div class="toast-container fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div class="${bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
        <div class="flex-shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${icon}
          </svg>
        </div>
        <p class="text-sm font-medium">${toastMessage}</p>
        <button class="toast-close-btn flex-shrink-0 ml-2 text-white hover:text-gray-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  `;

  // 테스트 환경에서는 #root에 추가, 실제 환경에서는 body에 추가
  const container = document.getElementById("root") || document.body;
  container.insertAdjacentHTML("beforeend", toastHTML);

  // 자동으로 3초 후 제거
  const toastElement = document.querySelector(".toast-container:last-child");
  setTimeout(() => {
    toastElement?.remove();
  }, 3000);

  // 닫기 버튼 이벤트
  toastElement?.querySelector(".toast-close-btn")?.addEventListener("click", () => {
    toastElement.remove();
  });
}

async function handleLimitChange(newLimit) {
  state.productCount = newLimit;
  state.page = 1; // limit 변경 시 첫 페이지로 리셋
  state.loading = true;

  // URL 업데이트
  updateUrlParams({
    limit: state.productCount,
    page: state.page,
    sort: state.sort,
    search: state.search,
    category1: state.selectedCategory1,
    category2: state.selectedCategory2,
  });

  render();

  // 새로운 limit으로 API 재호출
  const {
    products,
    pagination: { total },
  } = await getProducts({
    limit: state.productCount,
    sort: state.sort,
    search: state.search,
    category1: state.selectedCategory1,
    category2: state.selectedCategory2,
    page: state.page,
  });

  // 상태 업데이트
  state.products = products;
  state.total = total;
  state.loading = false;

  render();
}

async function handleSortChange(newSort) {
  state.sort = newSort;
  state.page = 1; // sort 변경 시 첫 페이지로 리셋
  state.loading = true;

  // URL 업데이트
  updateUrlParams({
    limit: state.productCount,
    page: state.page,
    sort: state.sort,
    search: state.search,
    category1: state.selectedCategory1,
    category2: state.selectedCategory2,
  });

  const {
    products,
    pagination: { total },
  } = await getProducts({
    limit: state.productCount,
    sort: newSort,
    search: state.search,
    category1: state.selectedCategory1,
    category2: state.selectedCategory2,
    page: state.page,
  });

  // 상태 업데이트
  state.products = products;
  state.total = total;
  state.loading = false;

  render();
}

let globalObserver = null;

async function loadMoreProducts() {
  if (state.loading || !state.hasNext) return;

  state.loading = true;
  render();

  // 1. 새 데이터 가져오기
  const newData = await getProducts({
    limit: state.productCount,
    page: state.page + 1,
    sort: state.sort,
    search: state.search,
    category1: state.selectedCategory1,
    category2: state.selectedCategory2,
  });

  // 2. 기존 배열에 추가 및 상태 변경
  state.products = [...state.products, ...newData.products];
  state.hasNext = newData.pagination.hasNext;
  state.hasPrev = newData.pagination.hasPrev;
  state.page = newData.pagination.page;
  state.loading = false;

  // 3. URL 업데이트
  updateUrlParams({
    limit: state.productCount,
    page: state.page,
    sort: state.sort,
    search: state.search,
    category1: state.selectedCategory1,
    category2: state.selectedCategory2,
  });

  // 4. 다시 그리기
  render();
}

function setupInfiniteScroll() {
  // 기존 observer 정리
  if (globalObserver) {
    globalObserver.disconnect();
  }
  const callback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && state.hasNext && !state.loading) {
        console.log("무한스크롤 트리거됨", state.page);
        loadMoreProducts();
      }
    });
  };
  globalObserver = new IntersectionObserver(callback);

  const sentinel = document.getElementById("scroll-sentinel");
  if (sentinel) {
    globalObserver.observe(sentinel);
  }
}

// 브라우저 뒤로가기/앞으로가기 처리
function setupPopstateHandler() {
  window.addEventListener("popstate", () => {
    // 라우터가 자동으로 처리하므로 별도 작업 불필요
    router.handleRouteChange(location.pathname, false);
  });
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(() => {
    main();
    setupEventListeners();
    setupProductDetailEventListeners();
    setupPopstateHandler();
  });
} else {
  main();
  setupEventListeners();
  setupProductDetailEventListeners();
}
