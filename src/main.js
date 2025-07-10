// 라우터 import 추가
import { createRouter } from "./router/Router.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

// 페이지 컴포넌트들
function HomePage() {
  return `
    <h1>메인 페이지</h1>
    <p>현재 경로: ${window.location.pathname}</p>
  `;
}

function ProductDetailPage(params = {}) {
  const { id } = params;
  return `
    <h1>상품 상세 페이지</h1>
    <p>상품 ID: ${id || "없음"}</p>
    <p>현재 경로: ${window.location.pathname}</p>
  `;
}

function NotFoundPage() {
  return `
    <h1>404 페이지</h1>
    <p>404 경로: ${window.location.pathname}</p>
  `;
}

// 전역 router 변수
let router;

function main() {
  // DOM이 준비되었는지 확인
  const root = document.getElementById("root");

  if (!root) {
    return;
  }

  // 라우터 설정
  router = createRouter({
    routes: [
      { path: "/", component: "Home" },
      { path: "/product/:id", component: "ProductDetail" }, // 동적 라우팅으로 변경
      { path: "*", component: "NotFound" },
    ],

    onNavigate: (route) => {
      // 라우트에 따라 페이지 렌더링
      let html = "";
      switch (route.component) {
        case "Home":
          html = HomePage();
          break;
        case "ProductDetail":
          html = ProductDetailPage(route.params); // 파라미터 전달
          break;
        case "NotFound":
        default:
          html = NotFoundPage();
          break;
      }

      // DOM에 렌더링
      const currentRoot = document.getElementById("root");
      if (currentRoot) {
        currentRoot.innerHTML = html;
      } else {
        console.error("Main: Root element not found during rendering");
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
