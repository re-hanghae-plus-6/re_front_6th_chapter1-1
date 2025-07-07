import { createRouter, setupRouter } from "./core/router";
import HomePage from "./page/HomePage";
import ProductDetailPage from "./page/ProductDetailPage";
import NotFoundPage from "./page/NotFoundPage";
import { getProduct } from "./api/productApi";

/**
 * 라우트 렌더러 클래스
 * 라우터와 DOM 조작을 분리하여 관심사 분리
 */
class RouteRenderer {
  constructor() {
    this.currentUnsubscribe = null;
    this.currentCleanup = null;
  }

  /**
   * 컴포넌트 렌더링
   * @param {Object} routeData - 라우트 데이터
   */
  async render(routeData) {
    if (!routeData || !routeData.route || !routeData.route.component) {
      return;
    }

    const { route, params, data } = routeData;

    try {
      // 이전 컴포넌트 정리
      this.cleanup();

      // 컴포넌트 실행 (동기/비동기 대응)
      const result = route.component({ ...params, ...data });
      const html = result instanceof Promise ? await result : result;

      // HTML 문자열이면 DOM 삽입
      if (typeof html === "string") {
        const $root = document.getElementById("root");
        if ($root) {
          $root.innerHTML = html;
        }

        // 컴포넌트별 이벤트 리스너 연결
        this.attachComponentEventListeners();
      }
    } catch (error) {
      console.error("Component render error:", error);
      this.renderError(error);
    }
  }

  /**
   * 컴포넌트별 이벤트 리스너 연결
   */
  attachComponentEventListeners() {
    // ProductDetailPage는 내부에서 이벤트 리스너를 처리하므로 별도 처리 불필요
    // 추가 컴포넌트 이벤트 리스너는 여기에 추가
  }

  /**
   * 에러 렌더링
   * @param {Error} error - 에러 객체
   */
  renderError(error) {
    const $root = document.getElementById("root");
    if ($root) {
      $root.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-gray-100">
          <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <div class="text-center">
              <h1 class="text-2xl font-bold text-red-600 mb-4">오류가 발생했습니다</h1>
              <p class="text-gray-600 mb-6">${error.message}</p>
              <button 
                onclick="window.location.reload()" 
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                페이지 새로고침
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }

  /**
   * 현재 컴포넌트 정리
   */
  cleanup() {
    if (this.currentCleanup) {
      this.currentCleanup();
      this.currentCleanup = null;
    }
  }

  /**
   * 렌더러 리소스 정리
   */
  destroy() {
    this.cleanup();
    if (this.currentUnsubscribe) {
      this.currentUnsubscribe();
      this.currentUnsubscribe = null;
    }
  }
}

/**
 * 애플리케이션 메인 클래스
 */
class Application {
  constructor() {
    this.router = null;
    this.renderer = null;
    this.routerUnsubscribe = null;
    this.globalClickHandler = this.handleGlobalClick.bind(this);
  }

  /**
   * 애플리케이션 초기화
   */
  async init() {
    try {
      // 라우터 설정
      this.setupRouter();

      // 렌더러 설정
      this.renderer = new RouteRenderer();

      // 글로벌 이벤트 리스너 설정
      this.setupGlobalEventListeners();

      // 라우터 초기화
      await this.router.init();

      console.log("App initialized successfully");
    } catch (error) {
      console.error("App initialization failed:", error);
    }
  }

  /**
   * 라우터 설정
   */
  setupRouter() {
    const routes = [
      {
        path: "/",
        component: () => HomePage({ cartCount: 0, onNavigate: null }),
      },
      {
        path: "/product/:id",
        component: ({ product }) => ProductDetailPage({ product, cartCount: 0, onNavigate: null }),
        loader: async ({ id }) => {
          try {
            const product = await getProduct(id);
            return { product };
          } catch (error) {
            console.error("Failed to load product detail:", error);
            throw error;
          }
        },
      },
      {
        path: "/404",
        component: NotFoundPage,
      },
    ];

    this.router = createRouter();
    this.router.addRoutes(routes);
    setupRouter(this.router);

    // 라우터 변경 리스너 등록
    this.routerUnsubscribe = this.router.subscribe(async (routeData) => {
      await this.renderer.render(routeData);
    });
  }

  /**
   * 글로벌 이벤트 리스너 설정
   */
  setupGlobalEventListeners() {
    document.addEventListener("click", this.globalClickHandler);
  }

  /**
   * 글로벌 클릭 이벤트 핸들러
   * @param {Event} e - 클릭 이벤트
   */
  handleGlobalClick(e) {
    // 링크 클릭 이벤트 처리
    const link = e.target.closest("[data-link]");
    if (link) {
      e.preventDefault();
      window.navigateTo(link.getAttribute("href"));
      return;
    }

    // 상품 클릭 이벤트 처리
    const productLink = e.target.closest("[data-product-link]");
    if (productLink) {
      e.preventDefault();
      const productId = productLink.getAttribute("data-product-link");
      if (productId) {
        window.navigateTo(`/product/${productId}`);
      }
      return;
    }
  }

  /**
   * 애플리케이션 정리
   */
  destroy() {
    // 이벤트 리스너 정리
    document.removeEventListener("click", this.globalClickHandler);

    // 라우터 구독 해제
    if (this.routerUnsubscribe) {
      this.routerUnsubscribe();
      this.routerUnsubscribe = null;
    }

    // 렌더러 정리
    if (this.renderer) {
      this.renderer.destroy();
      this.renderer = null;
    }

    // 라우터 정리는 setupRouter에서 자동으로 처리됨
    this.router = null;
  }
}

// 애플리케이션 인스턴스
let appInstance = null;

/**
 * 애플리케이션 시작
 */
export default function App() {
  if (!appInstance) {
    appInstance = new Application();
    appInstance.init();
  }
  return appInstance;
}

/**
 * 애플리케이션 정리 (테스트나 개발 시 사용)
 */
export function destroyApp() {
  if (appInstance) {
    appInstance.destroy();
    appInstance = null;
  }
}

// 페이지 언로드 시 자동 정리
window.addEventListener("beforeunload", () => {
  destroyApp();
});
