import { getCategories, getProducts } from "./api/productApi.js";
import handlers from "./handlers.js";
import { Home } from "./pages/Home.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

let state = {
  page: 1,
  products: [],
  categories: [],
  total: 0,
  loading: false,
  limit: 20,
  allLoaded: false,
  cart: [],
  search: "",
};

function render() {
  document.body.querySelector("#root").innerHTML = Home(state);

  handlers(state, render);
}

async function main() {
  const categoryData = await getCategories();

  state.loading = true;

  render();
  const productData = await getProducts({ limit: state.limit, search: state.search });

  state.products = productData.products;
  state.total = productData.pagination.total;
  state.categories = categoryData;
  state.loading = false;
  render();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
