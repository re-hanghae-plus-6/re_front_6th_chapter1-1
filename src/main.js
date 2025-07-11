import { createStore } from "./stores/index.js";
import { appReducer, initialState } from "./stores/reducer.js";
import { createProductService } from "./services/productService.js";
import { createRouter } from "./router/index.js";
import { createRenderer } from "./render.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

async function main() {
  const store = createStore(appReducer, initialState);
  const productService = createProductService(store);

  // 서비스 주입으로 의존성 명확히
  const router = createRouter(store, { productService });
  const renderer = createRenderer(store, productService, router);

  router.init();
  renderer.initRenderer();
}

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
