import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

class Router {
  constructor() {
    this.routes = {};
    this.init();
  }

  // 라우트 등록
  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  // 라우터 초기화
  init() {
    // 페이지 로드 시 현재 경로 처리
    this.handleRoute();

    // 브라우저 뒤로가기/앞으로가기 처리
    window.addEventListener("popstate", () => {
      this.handleRoute();
    });
  }

  // 페이지 이동
  navigate(path) {
    history.pushState({}, "", path);
    this.handleRoute();
  }

  // 현재 경로 처리
  handleRoute() {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search); // 쿼리 스트링 파싱

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

        // query params 추출출
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
}

const router = new Router();

/*
router.addRoute('/product/:productId', (params) => {
  const page = new ProductDetailPage(params.productId, {
    sort: params.sort,
    page: params.page,
  });
  document.getElementById('page-content').innerHTML = page.render();
  });

router.navigate('/product/123?sort=desc');
*/

// 라우트 등록
router.addRoute("/", () => {
  document.getElementById("page-content").innerHTML = new ProductListPage().render();
});

router.addRoute("/product/:productId", (params) => {
  document.getElementById("page-content").innerHTML = new ProductDetailPage(params.productId).render();
});

router.addRoute("*", () => {
  document.getElementById("page-content").innerHTML = new NotFoundPage().render();
});

export default router;
