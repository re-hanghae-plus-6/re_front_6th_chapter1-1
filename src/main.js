import { getProducts } from "./api/productApi.js";
import { getCategories } from "./api/productApi.js";
import { showToast } from "./components/Toast.js";
import { router } from "./router/index.js";
import { MainPage } from "./pages/MainPage.js";
import { Footer } from "./pages/Footer.js";

// MSW 초기화 상태 관리
let mswReady = false;
const mswReadyPromise = new Promise((resolve) => {
  window.mswResolve = resolve;
});

const enableMocking = async () => {
  try {
    const { worker } = await import("./mocks/browser.js");
    await worker.start({
      onUnhandledRequest: "bypass",
    });
    mswReady = true;
    window.mswResolve && window.mswResolve();
    return true;
  } catch (error) {
    console.error("MSW 초기화 실패:", error);
    return false;
  }
};

// MSW 준비 상태 확인 함수
export function isMSWReady() {
  return mswReady;
}

// MSW 준비까지 기다리는 함수
export function waitForMSW() {
  if (mswReady) {
    return Promise.resolve();
  }
  return mswReadyPromise;
}

// 1. 상태를 한 곳에서 관리
let state = {
  products: [],
  total: 0,
  categories: [],
  limit: 20,
  sort: "price_asc",
  search: "",
  loading: false,
  page: 1,
  hasMore: true,
  isFirstLoad: true, // 최초 진입 여부
  // ...필요한 상태 추가
};

// 2. 상태에 따라 UI를 그리는 함수
function render() {
  const path = window.location.pathname;
  const root = document.getElementById("root");

  // 메인 페이지는 상태와 함께 렌더링
  if (path === "/") {
    root.innerHTML = `
      ${MainPage(state)}
      ${Footer()}
    `;
  } else {
    // 다른 경로는 router로 처리
    router();
  }

  // SPA 내비게이션 처리
  document.querySelectorAll("a[data-link]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const href = a.getAttribute("href");
      window.history.pushState({}, "", href);
      render();
    });
  });

  // 장바구니 개수 뱃지 업데이트
  updateCartCountBadge();

  // select DOM이 다시 생성되므로 여기서 이벤트 등록
  const limitSelect = document.getElementById("limit-select");
  if (limitSelect) {
    limitSelect.addEventListener("change", (e) => {
      onLimitChange(Number(e.target.value));
    });
  }

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      onSortChange(e.target.value);
    });
  }

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        onSearchChange(e.target.value);
      }
    });
  }

  // 장바구니 담기 버튼 이벤트 등록
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.getAttribute("data-product-id");
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");

      if (!cart.includes(productId)) {
        cart.push(productId);
        localStorage.setItem("cart", JSON.stringify(cart));
        showToast("add");
        updateCartCountBadge();
      } else if (cart.includes(productId)) {
        showToast("already");
      } else {
        showToast("error");
      }
    });
  });

  // 무한 스크롤 이벤트 리스너 (메인 페이지에서만, 한 번만 등록)
  if (!window.scrollHandlerAdded) {
    window.addEventListener("scroll", () => {
      // 메인 페이지가 아니면 무한 스크롤 비활성화
      const path = window.location.pathname;
      if (path !== "/" || state.loading || !state.hasMore) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 100) {
        loadMoreProducts();
      }
    });
    window.scrollHandlerAdded = true;
  }
}

// 3. 데이터 fetch 및 상태 갱신 함수
async function fetchAndRender() {
  state.loading = true;
  state.total = 0; // 로딩 시작 시 0으로 초기화
  render();
  // 데이터 fetch
  const [
    {
      products,
      pagination: { total },
    },
    categories,
  ] = await Promise.all([
    getProducts({
      page: state.page,
      limit: state.limit,
      sort: state.sort,
      search: state.search,
    }),
    getCategories(),
  ]);
  state = {
    ...state,
    products,
    total,
    categories,
    loading: false,
    hasMore: products.length < total,
    isFirstLoad: false,
  };
  render();
}

// 무한 스크롤을 위한 추가 상품 로드 함수
async function loadMoreProducts() {
  if (state.loading || !state.hasMore) return;

  state.loading = true;
  state.page += 1;
  render();

  const {
    products: newProducts,
    pagination: { hasNext },
  } = await getProducts({
    page: state.page,
    limit: state.limit,
    sort: state.sort,
    search: state.search,
  });

  state = {
    ...state,
    products: [...state.products, ...newProducts],
    loading: false,
    hasMore: hasNext,
  };

  render();
}

// 4. 이벤트 핸들러는 상태를 바꾸고 fetchAndRender 호출
function onLimitChange(newLimit) {
  state.limit = newLimit;
  return fetchAndRender();
}

function onSortChange(newSort) {
  state.sort = newSort;
  return fetchAndRender();
}

function onSearchChange(newSearch) {
  state.search = newSearch;
  return fetchAndRender();
}

// 장바구니 개수 뱃지 표시 함수
function updateCartCountBadge() {
  const badge = document.getElementById("cart-count-badge");
  if (!badge) return;
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (cart.length > 0) {
    badge.textContent = cart.length;
    badge.style.display = "inline-block";
  } else {
    badge.textContent = "0";
    badge.style.display = "none";
  }
}

// 5. 앱 시작
async function startApp() {
  // MSW 초기화 (테스트 환경이 아닌 경우)
  if (import.meta.env.MODE !== "test") {
    await enableMocking();
  } else {
    // 테스트 환경에서는 MSW 준비 상태로 설정
    mswReady = true;
    window.mswResolve && window.mswResolve();
  }

  state.isFirstLoad = true;
  render();
  fetchAndRender();

  // popstate 이벤트 리스너 추가 (브라우저 뒤로가기/앞으로가기 및 테스트에서 사용)
  window.addEventListener("popstate", () => {
    // 앱 상태 초기화
    state = {
      products: [],
      total: 0,
      categories: [],
      limit: 20,
      sort: "price_asc",
      search: "",
      loading: false,
      page: 1,
      hasMore: true,
      isFirstLoad: true,
    };

    // 스크롤 이벤트 리스너 초기화
    window.scrollHandlerAdded = false;

    fetchAndRender();
  });
}

startApp();
