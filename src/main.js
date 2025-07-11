import {
  cartStore,
  categoriesStore,
  DEFAULT_LIMIT,
  productDetailStore,
  productsStore,
  relatedProductsStore,
} from "./store.js";
import { fetchProducts } from "./entities/products.js";
import { fetchCategories } from "./entities/categories.js";

import { renderHtml } from "./utils/renderHtml.js";

window.addEventListener("popstate", renderHtml);
async function main() {
  const params = new URLSearchParams(window.location.search);

  const sort = params.get("sort") || "price_asc";
  const search = params.get("search") || "";
  const limit = params.get("limit") || DEFAULT_LIMIT;
  const fetchParams = {
    sort,
    search,
    limit,
  };
  fetchProducts(fetchParams);
  fetchCategories();

  productsStore.subscribe(renderHtml);
  categoriesStore.subscribe(renderHtml);
  productDetailStore.subscribe(renderHtml);
  cartStore.subscribe(renderHtml);
  relatedProductsStore.subscribe(renderHtml);
  renderHtml();
}

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker, workerOptions }) => worker.start(workerOptions));

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
  console.log("Test환경인가요");
} else {
  main();
  // alert("hello!");
}
