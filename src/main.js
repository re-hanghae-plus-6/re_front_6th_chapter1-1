import { render } from "./utils/render.js";
import { productListState } from "./states/productState.js";
import { getProducts } from "./api/productApi.js";
import { Home } from "./pages/Home.js";
import { Product } from "./pages/Product.js";
import { NotFound } from "./pages/NotFound.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

async function main() {
  const path = location.pathname;

  productListState.isLoading = true;
  productListState.products = [];
  productListState.total = 0;

  const productListData = await getProducts({});

  productListState.isLoading = false;
  productListState.products = productListData.products;
  productListState.total = productListData.pagination.total;

  if (path === "/") {
    render(Home(productListState));
  } else if (path.startsWith("/product/")) {
    const productId = path.split("/product/")[1];
    await Product(productId);
  } else {
    render(NotFound());
  }
}

window.addEventListener("popstate", main);

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
