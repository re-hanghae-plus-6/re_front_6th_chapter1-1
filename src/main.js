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

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

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

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
