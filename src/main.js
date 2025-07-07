import { getCategories, getProducts } from "./api/productApi.js";
import { HomePage } from "./pages/HomePage.js";

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
  productCount: 20,
  page: 1,
  hasNext: false,
  hasPrev: false,
  sort: "price_asc",
};

function render() {
  document.body.querySelector("#root").innerHTML = HomePage(state);
  setupInfiniteScroll();
}

async function main() {
  // 초기값 - 로딩 상태 렌더링
  state.loading = true;
  render();

  // data fetch
  const [
    {
      products,
      pagination: { page, total, hasNext, hasPrev },
    },
    categories,
  ] = await Promise.all([getProducts({ limit: state.productCount, sort: state.sort }), getCategories()]);

  state.total = total;
  state.products = products;
  state.categories = categories;
  state.page = page;
  state.hasNext = hasNext;
  state.hasPrev = hasPrev;

  // 값 가져왔으니 로딩 상태 해제
  state.loading = false;

  render();
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
}

async function handleLimitChange(newLimit) {
  state.productCount = newLimit;
  state.loading = true;
  render();

  // 새로운 limit으로 API 재호출
  const {
    products,
    pagination: { total },
  } = await getProducts({ limit: state.productCount, sort: state.sort });

  // 상태 업데이트
  state.products = products;
  state.total = total;
  state.loading = false;

  render();
}

async function handleSortChange(newSort) {
  state.sort = newSort;
  state.loading = true;

  const {
    products,
    pagination: { total },
  } = await getProducts({ limit: state.productCount, sort: newSort });

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
  const newData = await getProducts({ limit: state.productCount, page: state.page + 1 });

  // 2. 기존 배열에 추가 및 상태 변경
  state.products = [...state.products, ...newData.products];
  state.hasNext = newData.pagination.hasNext;
  state.hasPrev = newData.pagination.hasPrev;
  state.page = newData.pagination.page;
  state.loading = false;

  // 3. 다시 그리기
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

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(() => {
    main();
    setupEventListeners();
  });
} else {
  main();
  setupEventListeners();
}
