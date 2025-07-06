import { createRouter, router } from "./router.js";
import { render } from "./render.js";
import { ProductListPage } from "./pages/ProductListPage.js";
import { ProductDetailPage } from "./pages/ProductDetailPage.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

const routes = {
  "/": ProductListPage,
  "/product/:id": ProductDetailPage,
};

function main() {
  router.set(createRouter(routes));

  router.get().subscribe(render);

  render();
}

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
