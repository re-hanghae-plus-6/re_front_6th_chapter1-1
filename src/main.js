import { Layout } from "./components/layout/Layout.js";
import { initializeApp } from "./config/app.js";
import { NotFound } from "./pages/NotFound.js";
import { ProductList } from "./pages/ProductList.js";
import { getCurrentParams, router } from "./utils/router.js";

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

// 라우터 설정
function setupRouter() {
  console.log("라우터 설정 시작...");

  // 상품 목록 페이지
  router.register("/", () => {
    console.log("홈 페이지 로드");
    appState.isDetailPage = false;
    renderApp(ProductList);
  });

  // 상품 상세 페이지 (동적 라우팅)
  router.register("/product/:id", () => {
    console.log("상품 상세 페이지 로드");
    appState.isDetailPage = true;
    const params = getCurrentParams();
    const productId = params.id;

    if (productId) {
      console.log("상품 상세 페이지 로드:", productId);
      // 여기에 상품 상세 페이지 로드 로직 추가
      // loadProductDetail(productId);
    }
  });

  // 404 페이지
  router.register("/404", () => {
    console.log("404 페이지 로드");
    appState.isDetailPage = false;
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = Layout({
        pageComponent: NotFound,
        cartCount: appState.cartCount,
        isDetailPage: appState.isDetailPage,
      });
    }
  });

  // 등록된 라우트 확인
  console.log("등록된 라우트:", router.getRegisteredRoutes());

  // 라우터 초기화 완료 후 초기 경로 처리
  router.initializeRoutes();
}

// 앱 실행 엔트리포인트
function main() {
  setupRouter();
  // 초기 렌더링은 라우터가 처리하므로 여기서는 제거
  // renderApp(ProductList);
}

window.addEventListener("popstate", () => {
  //url 변경 시 초기화
  initializeApp(main);
});

// 초기화 후 main 실행
initializeApp(main);
