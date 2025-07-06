import { Router } from "./core/Router.js";
import { NotFoundPage } from "./pages/NotFoundPage.js";
import { ProductListPage } from "./pages/ProductListPage.js";
import { ProductPage } from "./pages/ProductPage.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

class SPAService {
  constructor() {
    this.router = new Router();
    this.init();
  }

  init() {
    console.log("Create SPAService Instance!");

    // router 설정
    this.router.register("/", ProductListPage);
    this.router.register("/product/:productId", ProductPage);
    this.router.register("*", NotFoundPage);
    this.router.start();
  }
}

function main() {
  const spaService = new SPAService();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", spaService);
  } else {
    spaService;
  }
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
