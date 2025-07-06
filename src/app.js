import { getProduct } from "./api/productApi.js";
import { createRouter, setupRouter, useNavigate } from "./core/router.js";
import HomePage from "./components/page/HomePage.js";
import renderProductDetailPage from "./components/page/ProductDetailPage.js";
import MainLayout from "./components/layout/MainLayout.js";

// 애플리케이션 생성 함수
export function createApp() {
  const router = createRouter();

  // 라우트 정의
  setupRoutes(router);

  // 라우터 변경 시 렌더링
  router.subscribe(async (routeInfo) => {
    await render(routeInfo);
  });

  // 라우트 설정
  function setupRoutes(router) {
    // 홈페이지 라우트
    router.addRoute("/", "home");

    // 상품 상세 페이지 라우트 (파라미터 포함)
    router.addRoute("/product/:id", "product-detail", async (params) => {
      try {
        const product = await getProduct(params.id);
        return product;
      } catch (error) {
        console.error("상품 상세 정보 로딩 실패:", error);
        throw error; // 라우터가 404로 리다이렉트
      }
    });

    // 404 페이지 라우트
    router.addRoute("/404", "404");
  }

  // 렌더링 함수
  async function render(routeInfo) {
    const $root = document.getElementById("root");

    if (!routeInfo) return;

    const { route, data } = routeInfo;

    switch (route.component) {
      case "home":
        renderHomePage($root);
        break;

      case "product-detail":
        await renderProductDetailPage($root, data);
        break;

      case "404":
      default:
        render404Page($root);
        break;
    }
  }

  // 홈페이지 렌더링
  function renderHomePage($root) {
    $root.innerHTML = HomePage({
      cartCount: 0,
      onNavigate: useNavigate(),
    });
  }

  // 상품 상세 페이지 렌더링 (분리된 함수 사용)
  // renderProductDetailPage 함수를 별도 파일에서 import

  // 404 페이지 렌더링
  function render404Page($root) {
    $root.innerHTML = MainLayout({
      children: `<div class="text-center py-20">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">페이지를 찾을 수 없습니다</h1>
        <p class="text-gray-600 mb-8">요청하신 페이지가 존재하지 않습니다.</p>
        <button onclick="navigateTo('/')" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          홈으로 돌아가기
        </button>
      </div>`,
      cartCount: 0,
      showBackButton: true,
      title: "페이지를 찾을 수 없음",
    });
  }

  // 상품 상세 페이지 이벤트 리스너 등록 (분리된 함수 사용)
  // attachProductDetailEventListeners 함수를 별도 파일에서 import

  // 애플리케이션 초기화
  async function init() {
    // 전역 라우터 설정
    setupRouter(router);

    // 라우터 초기화
    await router.init();
  }

  // 공개 API
  return {
    init,
    router,
  };
}
