import Router from "./router/Router.js";
import { CartModalController } from "./controllers/CartModalController.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

function main() {
  const router = new Router(document.getElementById("root"));
  window.router = router;
  router.init();

  // 장바구니 모달 컨트롤러 초기화
  const cartModalController = new CartModalController();
  window.cartModalController = cartModalController;
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
