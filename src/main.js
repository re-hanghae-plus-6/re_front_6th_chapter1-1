import { initializeApp } from "./config/app.js";
import { Layout } from "./components/layout/Layout.js";
import { ProductList } from "./pages/ProductList.js";

function main() {
  // 상태 관리
  const state = {
    cartCount: 0, // 장바구니 아이템 개수
    isDetailPage: false, // 상품 상세 페이지 여부
  };

  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = Layout(ProductList, state.cartCount, state.isDetailPage);
  }

  // ProductList 컴포넌트 초기화
  if (typeof ProductList.init === "function") {
    ProductList.init();
  }
}

// 앱 초기화 후 main 실행
initializeApp(main);
