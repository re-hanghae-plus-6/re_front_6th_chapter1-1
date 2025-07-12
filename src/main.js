import { getCategories, getProducts, getProduct, getRelatedProducts } from "./api/productApi.js";
import { HomePage } from "./pages/HomePage.js";
import { ProductDetailPage } from "./pages/ProductDetailPage.js";
import { NotFoundPage } from "./pages/NotFoundPage.js";
import { showCartModal } from "./handlers/cart.js";
import { router } from "./router.js";
import { loadCartFromStorage, saveCartToStorage } from "./utils/cartStorage.js";
import { createHomePageHandlers } from "./handlers/homepage.js";
import { getSearchFromUrl, updateUrlParams } from "./handlers/url.js";
import { setupItemFilterEvents } from "./events/itemFilterEvents.js";
import { showToast } from "./components/Toast.js";

function syncStateWithUrl() {
  // path에서 검색어 추출
  const searchTerm = getSearchFromUrl();
  if (searchTerm) {
    state.search = searchTerm;
  } else if (window.location.pathname === "/") {
    // 홈페이지면 검색어 초기화
    state.search = "";
  }

  // URL 쿼리 파라미터에서 필터 정보 읽기
  const urlParams = new URLSearchParams(window.location.search);

  // 정렬 정보 복원
  const sort = urlParams.get("sort");
  if (sort && ["price_asc", "price_desc", "name_asc", "name_desc"].includes(sort)) {
    state.sort = sort;
  }

  // 페이지당 상품 수 복원
  const limit = urlParams.get("limit");
  if (limit && ["10", "20", "50", "100"].includes(limit)) {
    state.productCount = parseInt(limit);
  }

  // 페이지 번호 복원
  const page = urlParams.get("page");
  if (page && parseInt(page) > 0) {
    state.page = parseInt(page);
  }

  // 카테고리 정보 복원
  const category1 = urlParams.get("category1");
  if (category1) {
    state.selectedCategory1 = category1;
  }

  const category2 = urlParams.get("category2");
  if (category2) {
    state.selectedCategory2 = category2;
  }

  // 검색어 복원 (쿼리 파라미터에서)
  const searchQuery = urlParams.get("search");
  if (searchQuery && !searchTerm) {
    // path에서 검색어가 없는 경우에만
    state.search = searchQuery;
  }
}

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) => {
    const basePath = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";
    const serviceWorkerUrl = `${basePath}/mockServiceWorker.js`;

    return worker.start({
      serviceWorker: {
        url: serviceWorkerUrl,
      },
      onUnhandledRequest: "bypass",
    });
  });

// localStorage에서 장바구니 데이터 로드 (테스트 환경이 아닌 경우에만)
const { cart, selectedCartItems } =
  import.meta.env.MODE !== "test" ? loadCartFromStorage() : { cart: [], selectedCartItems: [] };

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
  cart: cart,
  selectedCartItems: selectedCartItems, // 선택된 장바구니 아이템 ID들
  search: "",
  selectedCategory1: null,
  selectedCategory2: null,
};

// 테스트 환경에서 state 접근 가능하도록 노출
if (import.meta.env.MODE === "test") {
  window.state = state;
}

function render() {
  document.body.querySelector("#root").innerHTML = HomePage(state);
  setupInfiniteScroll();
}

// 상태 업데이트 함수
function updateState(updates) {
  Object.assign(state, updates);
}

// 핸들러 생성
const handlers = createHomePageHandlers(state, updateState, render);

async function renderProductDetail(productId) {
  let product = state.products.find((p) => p.productId === productId);

  if (!product) {
    try {
      // 상품을 찾을 수 없으면 API에서 가져오기 시도
      product = await getProduct(productId);
    } catch (error) {
      console.warn("Product not found, redirecting to home, error: ", error);
      router.navigate("/");
      return;
    }
  }

  // 먼저 관련 상품 없이 렌더링
  document.body.querySelector("#root").innerHTML = ProductDetailPage({
    product,
    cart: state.cart,
    relatedProducts: [],
  });

  // 관련 상품을 API에서 가져오기
  const relatedProducts = await getRelatedProducts(product, 20);

  // 관련 상품과 함께 다시 렌더링
  document.body.querySelector("#root").innerHTML = ProductDetailPage({
    product,
    cart: state.cart,
    relatedProducts,
  });

  // 이벤트 핸들러 설정 (마지막에 한 번만)
  setupProductDetailEventListeners();
}

async function main() {
  // URL에서 초기 상태 동기화 (테스트 환경이 아닌 경우에만)
  if (import.meta.env.MODE !== "test") {
    syncStateWithUrl();
  }
  state.loading = true;
  setupRouter();
  render();

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
  state.page = page;
  state.hasNext = hasNext;
  state.hasPrev = hasPrev;

  // URL에서 복원된 카테고리 정보에 따라 categories 상태 설정
  if (state.selectedCategory1) {
    // category1이 선택된 경우 해당 카테고리의 서브카테고리 목록으로 설정
    const categoryDetail = categories[state.selectedCategory1];
    state.categories = categoryDetail || {};
  } else {
    // 전체 카테고리 목록 설정
    state.categories = categories;
  }

  // 값 가져왔으니 로딩 상태 해제
  state.loading = false;

  // 현재 URL에 따라 적절한 페이지 렌더링
  router.handleRouteChange(router.getRelativePath(location.pathname), false);
}

function setupRouter() {
  // 홈 페이지 라우트
  const homeHandler = () => {
    // 데이터가 이미 로드된 경우 로딩 상태를 false로 설정
    if (state.products.length > 0) {
      state.loading = false;
    }
    render();
  };

  router.addRoute("/", homeHandler);

  // base path가 있는 환경에서 base path 라우트도 홈으로 처리
  if (router.basePath) {
    router.addRoute(router.basePath + "/", homeHandler);
  }

  // 검색 페이지 라우트
  router.addRoute("/search=:searchTerm", (params) => {
    const searchTerm = decodeURIComponent(params.searchTerm);
    handleSearchFromUrl(searchTerm);
  });

  // 상품 상세 페이지 라우트
  router.addRoute("/product/:productId", async (params) => {
    await renderProductDetail(params.productId);
  });

  // 404 페이지 라우트
  router.addRoute("404", () => {
    document.body.querySelector("#root").innerHTML = NotFoundPage({
      cart: state.cart,
    });
  });
}

function setupEventListeners() {
  // 필터 관련 이벤트 리스너 설정
  setupItemFilterEvents(handlers);

  document.addEventListener("click", (event) => {
    if (event.target.matches(".add-to-cart-btn")) {
      const productId = event.target.dataset.productId;

      // 상품 상세 페이지에서는 수량 고려
      const quantityInput = document.querySelector("#quantity-input");
      const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

      addToCart(productId, quantity);
      showToast({ type: "add" });
    }

    const cartButton = document.querySelector("#cart-icon-btn");
    if (cartButton && (event.target === cartButton || cartButton.contains(event.target))) {
      showCartModal(state);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.matches("#search-input")) {
      const searchValue = event.target.value;
      handlers.handleSearch(searchValue);
    }
  });
}

function navigateToProductDetail(productId) {
  router.navigate(`/product/${productId}`);
}

// 상품 상세 페이지 이벤트 핸들러가 이미 설정되었는지 추적
let productDetailEventListenersSetup = false;

// 테스트 환경에서 플래그 접근 가능하도록 노출
if (import.meta.env.MODE === "test") {
  window.productDetailEventListenersSetup = productDetailEventListenersSetup;
}

function setupProductDetailEventListeners() {
  // 이미 설정되었다면 중복 설정 방지
  if (productDetailEventListenersSetup) {
    return;
  }

  productDetailEventListenersSetup = true;

  // 테스트 환경에서 플래그 동기화
  if (import.meta.env.MODE === "test") {
    window.productDetailEventListenersSetup = productDetailEventListenersSetup;
  }

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

    // 404 페이지의 홈으로 링크
    if (event.target.matches('a[href="/"]')) {
      event.preventDefault();
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

    // localStorage에 저장 (테스트 환경이 아닌 경우에만)
    if (import.meta.env.MODE !== "test") {
      saveCartToStorage(state.cart, state.selectedCartItems);
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

// 핸들러 사용으로 교체됨 - handlers.handleLimitChange, handlers.handleSortChange

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
