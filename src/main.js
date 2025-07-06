import { render } from "./utils/render.js";
import { productState } from "./states/productState.js";
import { getProducts } from "./api/productApi.js";
import { Home } from "./pages/Home.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

async function main() {
  const path = location.pathname;

  productState.isLoading = true;
  productState.products = [];
  productState.total = 0;

  const productData = await getProducts({});

  productState.isLoading = false;
  productState.products = productData.products;
  productState.total = productData.pagination.total;

  if (path === "/") {
    render(Home(productState));
  }
}

window.addEventListener("popstate", main);

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
