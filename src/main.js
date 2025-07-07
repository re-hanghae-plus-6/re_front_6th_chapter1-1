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
};

function render() {
  document.body.querySelector("#root").innerHTML = HomePage(state);
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
  ] = await Promise.all([getProducts({ limit: state.productCount }), getCategories()]);

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
  } = await getProducts({ limit: state.productCount });

  // 상태 업데이트
  state.products = products;
  state.total = total;
  state.loading = false;

  render();
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
