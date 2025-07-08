import { MainPage } from "./pages/MainPage.js";
import { Footer } from "./pages/Footer.js";
import { getProducts } from "./api/productApi.js";
import { getCategories } from "./api/productApi.js";
import { showToast } from "./components/Toast.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

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
  document.getElementById("root").innerHTML = `
     ${MainPage({
       products: state.products,
       total: state.total,
       loading: state.loading,
       isFirstLoad: state.isFirstLoad, // 전달
       categories: state.categories,
       limit: state.limit,
       search: state.search,
       sort: state.sort,
     })}
    ${Footer()}
  `;

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

  // 무한 스크롤 이벤트 리스너 (한 번만 등록)
  if (!window.scrollHandlerAdded) {
    window.addEventListener("scroll", () => {
      if (state.loading || !state.hasMore) return;

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
function startApp() {
  state.isFirstLoad = true;
  render();
  if (import.meta.env.MODE !== "test") {
    enableMocking().then(fetchAndRender);
  } else {
    fetchAndRender();
  }
}

startApp();
