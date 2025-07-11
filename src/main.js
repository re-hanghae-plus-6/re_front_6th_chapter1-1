import { router } from "./router/router.js";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import Cart from "./components/Cart.js";
import { cartStore } from "./store/store.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) => worker.start({ onUnhandledRequest: "bypass" }));

const cartInstance = new Cart();
const headerInstance = new Header();
const footerInstance = new Footer();

// 공통 레이아웃 렌더링 함수
function renderLayout() {
  const root = document.getElementById("root");
  if (!root) return;

  // 초기화
  root.innerHTML = "";

  // 공통 요소 렌더링
  const header = headerInstance.render();
  const footer = footerInstance.render();

  // 라우팅 대상 영역 생성
  const app = document.createElement("div");
  app.id = "app";

  // DOM에 삽입
  root.appendChild(header);
  root.appendChild(app);
  root.appendChild(footer);

  // Cart DOM이 root에 없으면 append
  if (!root.querySelector(".cart-modal")) {
    root.appendChild(cartInstance.render());
  }
}

export const app = () => {
  cartStore.initialize();

  renderLayout();
  router();
};

function main() {
  app(); // 초기 실행
  window.addEventListener("popstate", app);
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
