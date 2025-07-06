import { initializeApp } from "./config/app.js";
import { Layout } from "./components/layout/Layout.js";
import { ProductList } from "./pages/ProductList.js";

const appState = {
  cartCount: 0,
  isDetailPage: false,
};

function renderApp(PageComponent) {
  const root = document.getElementById("root");
  if (!root) return;

  const html = Layout({
    pageComponent: PageComponent,
    cartCount: appState.cartCount,
    isDetailPage: appState.isDetailPage,
  });

  root.innerHTML = html;

  if (typeof PageComponent.init === "function") {
    PageComponent.init();
  }
}

// 앱 실행 엔트리포인트
function main() {
  renderApp(ProductList);
}

// 초기화 후 main 실행
initializeApp(main);
