import { router } from "./router/router.js";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import Cart from "./components/Cart.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) => worker.start({ onUnhandledRequest: "bypass" }));

// 공통 레이아웃 렌더링 함수
function renderLayout() {
  const root = document.getElementById("root");
  if (!root) return;

  // 초기화
  root.innerHTML = "";

  // 공통 요소 렌더링
  const header = Header.init(); // 객체형 컴포넌트
  const cart = Cart.init(); // 모달형 컴포넌트
  const footer = Footer.init(); // 고정 하단 푸터

  // 라우팅 대상 영역 생성
  const app = document.createElement("div");
  app.id = "app";

  // DOM에 삽입
  root.appendChild(header);
  root.appendChild(app);
  root.appendChild(cart);
  root.appendChild(footer);
}

function main() {
  renderLayout();
  router();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
