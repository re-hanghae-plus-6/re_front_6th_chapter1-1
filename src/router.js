import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";

class Router {
  constructor() {
    this.routes = {};
    this.currentPage = null;
  }

  // 라우트 등록
  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  // 라우터 초기화
  init() {
    // 앱 DOM 구조 생성
    this.createAppStructure();

    this.handleRoute();
    window.addEventListener("popstate", () => {
      this.handleRoute();
    });
  }

  // 앱 DOM 구조 생성
  createAppStructure() {
    const root = document.getElementById("root");
    if (!root) return;

    const header = new Header();
    const footer = new Footer();

    root.innerHTML = /*html*/ `
      <div class="min-h-screen bg-gray-50">
        ${header.render()}
        <main id="page-content" class="max-w-md mx-auto px-4 py-4"></main>
        ${footer.render()}
      </div>
    `;
  }

  // 페이지 이동
  navigate(path) {
    history.pushState({}, "", path);
    this.handleRoute();
  }

  // 이전 페이지 정리
  cleanupCurrentPage() {
    if (this.currentPage && typeof this.currentPage.unmounted === "function") {
      this.currentPage.unmounted();
    }
    this.currentPage = null;
  }

  // 현재 경로 처리
  handleRoute() {
    this.cleanupCurrentPage();

    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    let matchedHandler = null;
    let params = {};

    // 정규식 기반으로 routes 탐색
    for (const routePath in this.routes) {
      const paramNames = [];
      const regexPath = routePath.replace(/:([^/]+)/g, (_, key) => {
        paramNames.push(key);
        return "([^/]+)";
      });

      const match = path.match(new RegExp(`^${regexPath}$`));
      if (match) {
        matchedHandler = this.routes[routePath];

        // path params 추출
        paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });

        // query params 추출
        for (const [key, value] of searchParams.entries()) {
          params[key] = value;
        }

        break;
      }
    }

    if (matchedHandler) {
      matchedHandler(params);
    } else if (this.routes["*"]) {
      this.routes["*"]();
    }
  }

  // 페이지 렌더링
  renderPage(page) {
    let pageContent = document.getElementById("page-content");

    // pageContent가 없다면 앱 구조를 다시 생성
    if (!pageContent) {
      this.createAppStructure();
      pageContent = document.getElementById("page-content");
    }

    if (pageContent) {
      pageContent.innerHTML = page.render();
      this.currentPage = page;

      // DOM이 삽입된 후 mounted 호출
      if (page.mounted) {
        page.mounted();
      }
    }
  }
}

const router = new Router();

// 라우트 등록
// 상품 목록 페이지 핸들러
router.addRoute("/", () => {
  const page = new ProductListPage();
  router.renderPage(page);
});

// 상품 상세 페이지 핸들러
router.addRoute("/product/:productId", (params) => {
  const page = new ProductDetailPage(params.productId);
  router.renderPage(page);
});

// 404 페이지 핸들러
router.addRoute("*", () => {
  const page = new NotFoundPage();
  router.renderPage(page);
});

export default router;
