import { Router } from "./router/Router.js";
import { categoriesStore, productsStore } from "./store.js";
import { fetchProducts } from "./entities/products.js";
import { fetchCategories } from "./entities/categories.js";
import { bindAllEvents } from "./events/bindAllEvents.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

const renderHtml = async () => {
  document.body.querySelector("#root").innerHTML = await Router();
  bindAllEvents();
};
window.addEventListener("popstate", renderHtml);
async function main() {
  const {
    pagination: { limit },
  } = productsStore.state;

  fetchProducts({ limit });
  fetchCategories();
  // document.body.querySelector("#root").innerHTML = await Router();
  productsStore.subscribe(renderHtml);
  categoriesStore.subscribe(renderHtml);
  renderHtml();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
