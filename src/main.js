import { HomePage } from "./pages/Homepage.js";
import { getProducts, getCategories } from "./api/productApi.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

async function main() {
  state.loading = true;
  render();
  const [{ products, pagination }, categories] = await Promise.all([getProducts({}), getCategories()]);
  state.categories = categories;
  state.products = products;
  state.total = pagination.total;
  state.loading = false;
  render();
}

let state = {
  categories: {},
  products: [],
  total: 0,
  loading: false,
};

const render = () => {
  const root = document.body.querySelector("#root");
  root.innerHTML = HomePage(state);
};

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
