import Router from "./utils/router.js";
import routes from "./routes.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

function main() {
  const router = Router();

  // 라우트 등록

  Object.entries(routes).forEach(([path, component]) => {
    router.addRoute(path, component);
  });

  router.init();
  router.navigate("/");
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
