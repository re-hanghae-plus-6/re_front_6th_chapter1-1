import { Router } from "./router/router.js";
// import routes from "./routes.js";

const enableMocking = () => import("./mocks/browser.js").then(({ worker, workOptions }) => worker.start(workOptions));

function main() {
  const router = Router();
  window.router = router;

  // Object.entries(routes).forEach(([path, component]) => {
  //   router.addRoute(path, component);
  // });

  router.init();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
