import { Router } from "./core/Router.js";
import { NotFoundPage } from "./pages/NotFoundPage.js";
import { ProductListPage } from "./pages/ProductListPage.js";
import { ProductPage } from "./pages/ProductPage.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker, workerOptions }) => worker.start(workerOptions));

class SPAService {
  constructor() {
    this.router = new Router("#root");
    this.init();
  }

  init() {
    this.router.register("/", ProductListPage);
    this.router.register("/product/:productId", ProductPage);
    this.router.register("*", NotFoundPage);
    this.router.start();
  }
}

function main() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => new SPAService());
  } else {
    new SPAService();
  }
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
