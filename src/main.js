import { getProducts, getCategories } from "./api/productApi.js";
import MainLayout from "./components/layout/MainLayout.js";
import FilterSection from "./components/filter/FilterSection.js";
import ProductGrid from "./components/product/ProductGrid.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

// 초기 상태 정의
const initialState = {
  test: "test",
  products: [],
  categories: [],
  total: 0,
  loading: false,
  categoriesLoading: false,
  searchValue: "",
  selectedCategory1: "",
  selectedCategory2: "",
  selectedSort: "price_asc",
  selectedLimit: "20",
  currentPage: 1,
  hasMore: true,
  scrollLoading: false,
};

function createStateManager(initialState) {
  let state = { ...initialState };

  const listeners = new Set();

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener); // unsubscribe
  }
  function setState(partial) {
    state = { ...state, ...partial };
    listeners.forEach((listener) => listener(state));
  }

  function getState() {
    return state;
  }

  return {
    setState,
    getState,
    subscribe,
  };
}

const stateManager = createStateManager(initialState);
stateManager.subscribe(render);

function render() {
  console.log("render");
  console.log(stateManager.getState());
  const $root = document.getElementById("root");

  if (!$root) return;

  const {
    products,
    categories,
    loading,
    categoriesLoading,
    selectedCategory1,
    selectedCategory2,
    selectedSort,
    selectedLimit,
    searchValue,
    total,
  } = stateManager.getState();

  $root.innerHTML = MainLayout({
    children: `
    ${FilterSection({
      searchValue,
      categories,
      selectedCategory1,
      selectedCategory2,
      selectedSort,
      selectedLimit,
      isLoading: categoriesLoading,
    })}

    ${ProductGrid({
      products,
      totalCount: total,
      isLoading: loading,
      hasMore: true,
    })}
  `,
    cartCount: 0,
    showBackButton: false,
    title: "상품 목록",
  });
}

// 라우터 관리
function router() {
  const path = window.location.pathname;

  if (path === "/" || path === "") {
    render();
  }
}

async function fetchInitDatas() {
  const [productsResponse, categories] = await Promise.all([getProducts(), getCategories()]);
  return {
    products: productsResponse.products || [],
    total: productsResponse.pagination?.total || 0,
    categories,
  };
}

async function main() {
  // 라우터 설정
  window.addEventListener("popstate", router);
  // 초기 라우트 처리
  router();

  // 초기 데이터 로드 시작
  stateManager.setState({
    loading: true,
    categoriesLoading: true,
  });

  // 초기 데이터 로딩
  const { products, categories, total } = await fetchInitDatas();

  // 초기 데이터 로딩 완료
  stateManager.setState({
    products,
    categories,
    total,
    loading: false,
    categoriesLoading: false,
  });
}

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
