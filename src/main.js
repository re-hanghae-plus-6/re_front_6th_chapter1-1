import { createStore } from "./stores/index.js";
import { appReducer, initialState } from "./stores/reducer.js";
import { createProductService } from "./services/productService.js";
import { createRenderer } from "./render.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

// 앱 초기화
async function main() {
  const store = createStore(appReducer, initialState);
  const productService = createProductService(store);
  const renderer = createRenderer(store, productService);

  //  렌더링 설정
  renderer.initRenderer();

  // 초기 데이터 로드
  await productService.loadCategories();
  await productService.loadProducts();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
