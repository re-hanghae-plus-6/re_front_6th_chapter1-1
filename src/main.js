import { getProducts } from "./api/productApi.js";
import { ProductListPage } from "./pages/productListPage.js";
import { store } from "./store.js";
import { actions } from "./actions.js";

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
  store.dispatch(actions.loadProducts());

  try {
    const data = await getProducts();
    store.dispatch(actions.productsLoaded(data));
  } catch (error) {
    store.dispatch(actions.loadError(error.message));
  }
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
