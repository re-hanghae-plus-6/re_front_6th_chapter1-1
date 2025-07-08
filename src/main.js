import { getCategories, getProducts } from "./api/productApi.js";
import initializeHandlers from "./handlers/index.js";
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
  isLoading: false,
  selectedLimit: "20",
  allLoaded: false,
  cart: [],
  search: "",
  selectedCategory1: "",
  selectedCategory2: "",
  selectedSort: "price_asc",
  cartCount: 0,
};

function render() {
  document.body.querySelector("#root").innerHTML = Home(state);

  initializeHandlers(state, render);
}

async function main() {
  state.isLoading = true;
  render();
  const [categoryData, productData] = await Promise.all([
    getCategories(),
    getProducts({
      limit: parseInt(state.selectedLimit),
      search: state.search,
      category1: state.selectedCategory1,
      category2: state.selectedCategory2,
      sort: state.selectedSort,
    }),
  ]);
  state.products = productData.products;
  state.total = productData.pagination.total;
  state.categories = categoryData;
  state.isLoading = false;

  render();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
