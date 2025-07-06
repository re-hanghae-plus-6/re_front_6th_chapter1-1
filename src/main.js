import { getProducts, getCategories } from "./api/productApi.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

// 초기 상태 정의
const initialState = {
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
  console.log("상품 목록 렌더링 중...");
  // TODO: 실제 상품 목록 렌더링 로직 구현
}

// 라우터 관리
function router() {
  const path = window.location.pathname;

  if (path === "/" || path === "") {
    render();
  }
}

async function fetchInitDatas() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return { products, categories };
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
  const { products, categories } = await fetchInitDatas();

  // 초기 데이터 로딩 완료
  stateManager.setState({
    products,
    categories,
    total: products.length,
    loading: false,
  });

  console.log(stateManager.getState());
}

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
