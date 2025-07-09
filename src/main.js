import { createRouter, router } from "./router.js";
import { render } from "./render.js";
import { addEvent } from "./utils/eventManager.js";
import { ProductListPage } from "./pages/ProductListPage.js";
import { ProductDetailPage } from "./pages/ProductDetailPage.js";
import { initCartModal } from "./features/cart/components/CartModal.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

addEvent("click", "[data-link]", (e) => {
  e.preventDefault();
  router.get().push(e.target.href.replace(window.location.origin, ""));
});

const routes = {
  "/": ProductListPage,
  "/product/:id": ProductDetailPage,
};

function main() {
  router.set(createRouter(routes));

  router.get().subscribe(render);

  initCartModal();

  render();
}

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
