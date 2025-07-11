// 라우터 import 추가
import { createRouter } from "./router/Router.js";
import { render, subscribeToStore } from "./renderer/render.js";
import { setupGlobalEventListeners } from "./events/eventListeners.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

// 전역 router 변수
let router;

function main() {
  const root = document.getElementById("root");
  if (!root) return;

  // 상태 구독 시스템 시작 (Store 변경 시 자동 리렌더링)
  subscribeToStore();

  // 전역 이벤트 위임 시스템 시작
  setupGlobalEventListeners();

  // 라우터 설정
  router = createRouter({
    routes: [
      { path: "/", component: "Home" },
      { path: "/product/:id", component: "ProductDetail" },
      { path: "*", component: "NotFound" },
    ],

    onNavigate: (route, query) => {
      // URLSearchParams를 객체로 변환
      const queryObj = {};
      for (const [key, value] of query) {
        queryObj[key] = value;
      }

      // 라우트에 따라 렌더링 - render.js 사용
      switch (route.component) {
        case "Home":
          render("home", queryObj);
          break;
        case "ProductDetail":
          render("product-detail", route.params);
          break;
        case "NotFound":
        default:
          render("404");
          break;
      }
    },
  });

  // 전역 스코프에 router 노출
  window.router = router;

  // 라우터 초기화
  router.init();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
