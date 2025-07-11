import { ProductListPage } from "./pages/productListPage.js";
import { ProductDetailPage } from "./pages/productDetailPage.js";
import { render } from "./render.js";
import { router } from "./router.js";
import { store } from "./store.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}/mockServiceWorker.js`,
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
    regex: /^\/$/,
    page: ProductListPage,
  });
  router.addRoute("/product/:id", {
    regex: /^\/product\/\d+/,
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
