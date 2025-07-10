import Header from "./components/layout/Header.js";
import { Layout } from "./components/layout/Layout.js";
import { initializeApp } from "./config/app.js";
import { NotFound } from "./pages/NotFound.js";
import { ProductDetail } from "./pages/ProductDetail.js";
import { ProductList } from "./pages/ProductList.js";
import { CartStorage } from "./utils/CartStorage.js";
import { router } from "./utils/router.js";

const appState = {
  isDetailPage: false,
};

function renderApp(PageComponent) {
  const root = document.getElementById("root");
  if (!root) return;

  const html = Layout({
    pageComponent: PageComponent,
    isDetailPage: appState.isDetailPage,
  });

  root.innerHTML = html;

  if (typeof PageComponent.init === "function") {
    PageComponent.init();
  }

  if (typeof Header.init === "function") {
    Header.init();
  }

  // CartStorage 카운터 시스템 초기화
  CartStorage.initCounter();
}

// 라우터 설정
function setupRouter() {
  router
    // 홈 페이지 (상품 목록)
    .register("/", () => {
      appState.isDetailPage = false;
      renderApp(ProductList);
    })

    // 상품 상세 페이지
    .register("/product/:id", () => {
      appState.isDetailPage = true;
      renderApp(ProductDetail);
    })

    // 404 페이지
    .register("/404", () => {
      appState.isDetailPage = false;
      renderApp(NotFound);
    })

    // 라우터 초기화
    .init();
}

// 앱 실행 엔트리포인트
function main() {
  setupRouter();
}

window.addEventListener("popstate", () => {
  //url 변경 시 초기화
  initializeApp(main);
});

// 초기화 후 main 실행
initializeApp(main);
