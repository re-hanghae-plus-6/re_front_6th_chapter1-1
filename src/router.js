import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";

const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

const getAppPath = (fullPath = window.location.pathname) => {
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
};

const getFullPath = (appPath) => {
  return BASE_PATH + appPath;
};

class Router {
  constructor() {
    this.routes = {};
    this.currentPage = null;
    this.header = null;
    this.footer = null;
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
      history.replaceState({ isPopState: true }, "");
      this.handleRoute();
    });
  }

  // 앱 DOM 구조 생성
  createAppStructure() {
    const root = document.getElementById("root");
    if (!root) return;

    // 기존 컴포넌트 정리
    if (this.header) this.header.unmounted();
    if (this.footer) this.footer.unmounted();

    this.header = new Header();
    this.footer = new Footer();

    root.innerHTML = /*html*/ `
      <div class="min-h-screen bg-gray-50">
        ${this.header.render()}
        <main id="page-content" class="max-w-md mx-auto px-4 py-4"></main>
        <div id="toast-container"></div>
        ${this.footer.render()}
      </div>
    `;

    // 컴포넌트 mounted 호출
    if (this.header.mounted) this.header.mounted();
    if (this.footer.mounted) this.footer.mounted();
  }

  // 페이지 이동
  navigate(path) {
    const fullPath = getFullPath(path);
    history.pushState({ isPopState: false }, "", fullPath);
    this.handleRoute();
  }

  // 이전 페이지 정리
  async cleanupCurrentPage() {
    if (this.currentPage) {
      // 현재 페이지의 모든 진행 중인 작업을 취소
      if (typeof this.currentPage.cleanup === 'function') {
        await this.currentPage.cleanup();
      }
      // unmounted 호출
      if (typeof this.currentPage.unmounted === "function") {
        await this.currentPage.unmounted();
      }
      // DOM에서 페이지 컨텐츠 제거
      const pageContent = document.getElementById("page-content");
      if (pageContent) {
        pageContent.innerHTML = '';
      }
      this.currentPage = null;
    }
  }

  // 현재 경로 처리
  async handleRoute() {
    // 이전 페이지 정리를 먼저 완료
    await this.cleanupCurrentPage();

    const path = getAppPath();
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

      let match = null;
      try {
        match = path.match(new RegExp(`^${regexPath}$`));
      } catch {
        continue; // 정규식 에러 시 다음 라우트로
      }

      if (match) {
        // 필수 param이 비어있으면 매칭 실패로 간주
        if (paramNames.some((_, idx) => !match[idx + 1])) {
          continue;
        }
        matchedHandler = this.routes[routePath];
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
      await matchedHandler(params);
    } else if (this.routes["*"]) {
      await this.routes["*"]();
    }
  }

  // 페이지 렌더링
  async renderPage(page) {
    let pageContent = document.getElementById("page-content");

    // pageContent가 없다면 앱 구조를 다시 생성
    if (!pageContent) {
      this.createAppStructure();
      pageContent = document.getElementById("page-content");
    }

    if (pageContent) {
      // 렌더링 전에 로딩 상태 표시
      pageContent.innerHTML = `
        <div class="flex justify-center items-center min-h-screen">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      `;

      // 페이지 렌더링
      pageContent.innerHTML = page.render();
      this.currentPage = page;

      // DOM이 삽입된 후 mounted 호출
      if (page.mounted) {
        await page.mounted();
      }
    }
  }
}

const router = new Router();

/* ================================================
 * 라우트 등록
 * ================================================ */
// 상품 목록 페이지 핸들러
router.addRoute("/", async () => {
  const page = new ProductListPage();
  await router.renderPage(page);
});

// 상품 상세 페이지 핸들러
router.addRoute("/product/:productId", async (params) => {
  if (!params.productId) {
    const page = new NotFoundPage();
    await router.renderPage(page);
    return;
  }
  const page = new ProductDetailPage(params.productId);
  await router.renderPage(page);
});

// 404 페이지 핸들러
router.addRoute("*", async () => {
  const page = new NotFoundPage();
  await router.renderPage(page);
});

export default router;
