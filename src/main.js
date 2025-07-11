import { ProductListPage } from "./pages/productListPage.js";
import { ProductDetailPage } from "./pages/productDetailPage.js";
import { render } from "./render.js";
import { router } from "./router.js";
import { store } from "./store.js";
import { BASE_PATH } from "./constants.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: `${BASE_PATH}/mockServiceWorker.js`,
      },
    }),
  );

function main() {
  store.subscribe({
    update: () => {
      render({ state: store.state });
    },
  });

  router.addRoute("/", {
    regex: new RegExp(`^${BASE_PATH}/?$`),
    page: ProductListPage,
  });
  router.addRoute("/product/:id", {
    regex: new RegExp(`^${BASE_PATH}/product/\\d+$`),
    page: ProductDetailPage,
  });

  store.notify();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
