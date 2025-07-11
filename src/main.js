import { productListPage } from "./pages/productListPage.js";
import { getProducts, getCategories } from "./api/productApi.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      },
    }),
  );

const state = {
  products: [],
  total: 0,
  loading: false,
  categories: {},
};

function render() {
  document.body.querySelector("#root").innerHTML = productListPage(state);
}

async function main() {
  state.loading = true;
  render();
  // const data = await getProducts({});
  // const [product, categories] = await Promise.all[(getProducts({}), getCategories())];
  const [
    {
      products,
      pagination: { total },
    },
    categories,
  ] = await Promise.all([getProducts({}), getCategories()]);

  state.products = products;
  state.total = total;
  state.categories = categories;
  state.loading = false;

  render();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
