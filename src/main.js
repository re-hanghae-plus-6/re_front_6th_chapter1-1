import { Home } from "./pages/Home.js";
import { Product } from "./pages/Product.js";
import { NotFound } from "./pages/NotFound.js";
import { getCartCount } from "./states/cart/cartStore.js";
import { cartStore } from "./states/cart/cartStore.js";
import { renderCartCount } from "./components/Layout/Header.js";
import { addHeaderEvents } from "./components/Modal/CartModal.js";
import { getAppPath } from "./router.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker, workerOptions }) => worker.start(workerOptions));

async function main() {
  const path = getAppPath();
  const cartCount = getCartCount();

  if (path === "/") {
    Home(cartCount);
  } else if (path.startsWith("/product/")) {
    const productId = path.split("/product/")[1];
    await Product(productId, cartCount);
  } else {
    NotFound();
  }

  cartStore.subscribe((items) => {
    const cartBtn = document.querySelector("#cart-icon-btn");
    if (!cartBtn) return;

    const existing = cartBtn.querySelector("span");
    if (existing) existing.remove();

    cartBtn.insertAdjacentHTML("beforeend", renderCartCount(items.length));
  });

  addHeaderEvents();
}

window.addEventListener("popstate", main);

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
