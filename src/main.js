import { createRouter, router } from "./router.js";
import { render } from "./render.js";
import { addEvent } from "./utils/eventManager.js";
import { ProductListPage } from "./pages/ProductListPage.js";
import { ProductDetailPage } from "./pages/ProductDetailPage.js";
import { initCartModal } from "./features/cart/components/CartModal.js";
import { cartStore } from "./features/cart/store/cartStore.js";
import { Header } from "./app/components/Header.js";
import { updateElement } from "./utils/domUtils.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker, workerOptions }) => worker.start(workerOptions));

addEvent("click", "[data-link]", (e) => {
  e.preventDefault();
  router.get().push(e.target.href.replace(window.location.origin, ""));
});

const routes = {
  "/": ProductListPage,
  "/product/:id": ProductDetailPage,
};

const headerState = {
  title: "쇼핑몰",
  showBackButton: false,
};

const updateHeader = () => {
  updateElement("header", Header(headerState));
};

const updateHeaderStateByRoute = () => {
  const currentPath = router.get().path;
  if (currentPath.startsWith("/product/")) {
    headerState.title = "상품 상세";
    headerState.showBackButton = true;
  } else {
    headerState.title = "쇼핑몰";
    headerState.showBackButton = false;
  }
};

function main() {
  router.set(createRouter(routes));

  router.get().subscribe(render);

  router.get().subscribe(() => {
    updateHeaderStateByRoute();
    updateHeader();
  });

  initCartModal();

  cartStore.subscribe(() => {
    updateHeader();
  });

  render();
}

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
