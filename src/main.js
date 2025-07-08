import { ProductListPage } from "./pages/productListPage.js";
import { store } from "./store.js";
import { ProductListController } from "./controllers/productListController.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

function render() {
  const state = store.getState();
  document.body.querySelector("#root").innerHTML = ProductListPage(state);
}

store.subscribe(render);

async function main() {
  const controller = new ProductListController();
  await controller.initialize();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
