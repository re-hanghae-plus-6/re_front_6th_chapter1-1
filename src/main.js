import { ProductListPage } from "./pages/ProductListPage.js";
import { getProducts, getCategories } from "./api/productApi.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

let state = {
  products: [],
  total: 0,
  loading: false,
  categories: {},
};

// URL 파라미터 파싱 함수
function getURLParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    limit: parseInt(params.get("limit")) || 20,
    page: parseInt(params.get("page")) || 1,
  };
}

// URL 업데이트 함수
function updateURL(params) {
  const currentParams = getURLParams();
  const newParams = { ...currentParams, ...params };
  const queryString = new URLSearchParams(newParams).toString();
  const newURL = `${window.location.pathname}?${queryString}`;
  window.history.pushState({}, "", newURL);
}

// 렌더링 함수
function render() {
  const root = document.body.querySelector("#root");
  root.innerHTML = ProductListPage(state);

  // 이벤트 리스너 등록
  attachEventListeners();
}

// 이벤트 리스너 등록 함수
function attachEventListeners() {
  // limit select 이벤트
  const limitSelect = document.querySelector("#limit-select");
  if (limitSelect) {
    const currentLimit = getURLParams().limit;
    limitSelect.value = currentLimit;

    limitSelect.onchange = async (e) => {
      const newLimit = parseInt(e.target.value);
      updateURL({ limit: newLimit, page: 1 });
      await loadProducts();
    };
  }
}

// 상품 로딩 함수
async function loadProducts() {
  state.loading = true;
  render();

  const params = getURLParams();
  const { products, pagination } = await getProducts(params);

  state.products = products;
  state.total = pagination.total;
  state.loading = false;

  render();
}

async function main() {
  state.loading = true;
  render();

  // 카테고리는 한 번만 로드
  const categories = await getCategories();
  state.categories = categories;

  // 상품 로드
  await loadProducts();
}

// popstate 이벤트 처리 (브라우저 뒤로가기/앞으로가기)
window.addEventListener("popstate", () => {
  loadProducts();
});

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
