import { router } from "./router/router.js";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import Cart from "./components/Cart.js";
import { cartStore } from "./store/store.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) => worker.start({ onUnhandledRequest: "bypass" }));

// Cart 인스턴스는 앱 전체에서 단 한 번만 생성
const cartInstance = new Cart();

// 공통 레이아웃 렌더링 함수
function renderLayout() {
  const root = document.getElementById("root");
  if (!root) return;

  // 초기화
  root.innerHTML = "";

  // 공통 요소 렌더링
  const header = new Header().render();
  const footer = new Footer().render();

  // 라우팅 대상 영역 생성
  const app = document.createElement("div");
  app.id = "app";

  // DOM에 삽입
  root.appendChild(header);
  root.appendChild(app);
  root.appendChild(footer);

  // Cart DOM이 root에 없으면 append
  if (!root.querySelector(".cart-modal")) {
    // cartInstance.render()는 항상 새로운 DOM을 반환하므로, Cart가 열릴 때만 동적으로 append하는 구조라면,
    // 여기서는 Cart의 구독/상태 동기화만 보장하고, DOM은 Cart 내부에서 관리하게 둡니다.
    // 하지만 테스트 환경에서는 Cart 모달이 항상 root에 있어야 하므로, Cart의 render()를 한 번 append합니다.
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
