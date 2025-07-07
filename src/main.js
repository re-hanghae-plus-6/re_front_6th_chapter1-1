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
      pagination: { total },
    },
    categories,
  ] = await Promise.all([getProducts({}), getCategories()]);

  state.total = total;
  state.products = products;
  state.categories = categories;

  // 값 가져왔으니 로딩 상태 해제
  state.loading = false;

  render();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
