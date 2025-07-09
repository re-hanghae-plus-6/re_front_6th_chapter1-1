import { Home } from "./pages/Home.js";
import { Product } from "./pages/Product.js";
import { NotFound } from "./pages/NotFound.js";
import { addHeaderEvents } from "./components/Modal/CartModal.js";
import { getCartCount } from "./states/cart/cartStore.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

async function main() {
  const path = location.pathname;
  const cartCount = getCartCount();

  if (path === "/") {
    Home({ cartCount: cartCount });
  } else if (path.startsWith("/product/")) {
    const productId = path.split("/product/")[1];
    await Product(productId);
  } else {
    NotFound();
  }

  addHeaderEvents();
}

window.addEventListener("popstate", main);

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
