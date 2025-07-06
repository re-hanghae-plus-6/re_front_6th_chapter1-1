// React-router와 유사한 라우터 시스템

class Router {
  constructor() {
    this.routes = [];
    this.currentRoute = null;
    this.listeners = new Set();

    // popstate 이벤트 리스너 등록
    window.addEventListener("popstate", () => {
      this.handleRouteChange();
    });
  }

  // 라우트 정의
  addRoute(path, component, loader = null) {
    this.routes.push({
      path,
      component,
      loader,
      // 경로를 정규식으로 변환하여 파라미터 매칭
      regex: this.pathToRegex(path),
      paramNames: this.extractParamNames(path),
    });
  }

  // 경로를 정규식으로 변환
  pathToRegex(path) {
    // /product/:id -> /product/([^/]+)
    const regexPath = path
      .replace(/:\w+/g, "([^/]+)") // :id -> ([^/]+)
      .replace(/\//g, "\\/") // / -> \/
      .replace(/\*/g, ".*"); // * -> .*

    return new RegExp(`^${regexPath}$`);
  }

  // 파라미터 이름 추출
  extractParamNames(path) {
    const matches = path.match(/:(\w+)/g);
    return matches ? matches.map((match) => match.slice(1)) : [];
  }

  // 현재 경로와 라우트 매칭
  matchRoute(pathname) {
    for (const route of this.routes) {
      const match = pathname.match(route.regex);
      if (match) {
        // 파라미터 값 추출
        const params = {};
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });

        return {
          route,
          params,
          pathname,
        };
      }
    }
    return null;
  }

  // 라우트 변경 처리
  async handleRouteChange() {
    const pathname = window.location.pathname;
    const matchedRoute = this.matchRoute(pathname);

    if (matchedRoute) {
      // 로더가 있으면 데이터 로드
      let data = null;
      if (matchedRoute.route.loader) {
        try {
          data = await matchedRoute.route.loader(matchedRoute.params);
        } catch (error) {
          console.error("Route loader error:", error);
          // 404로 리다이렉트
          this.navigate("/404");
          return;
        }
      }

      this.currentRoute = {
        ...matchedRoute,
        data,
      };
    } else {
      // 매칭되는 라우트가 없으면 404
      this.currentRoute = {
        route: this.routes.find((r) => r.path === "/404") || { path: "/404", component: null },
        params: {},
        pathname,
        data: null,
      };
    }

    // 리스너들에게 라우트 변경 알림
    this.notifyListeners();
  }

  // 프로그래밍 방식 네비게이션
  navigate(path, options = {}) {
    const { replace = false } = options;

    if (replace) {
      window.history.replaceState({}, "", path);
    } else {
      window.history.pushState({}, "", path);
    }

    this.handleRouteChange();
  }

  // 라우트 변경 리스너 등록
  subscribe(listener) {
    this.listeners.add(listener);

    // 구독 해제 함수 반환
    return () => {
      this.listeners.delete(listener);
    };
  }

  // 리스너들에게 알림
  notifyListeners() {
    this.listeners.forEach((listener) => {
      listener(this.currentRoute);
    });
  }

  // 현재 라우트 정보 반환
  getCurrentRoute() {
    return this.currentRoute;
  }

  // 라우터 초기화
  async init() {
    await this.handleRouteChange();
  }
}

// 라우터 인스턴스 생성 함수
export function createRouter() {
  return new Router();
}

// 전역 라우터 인스턴스
let globalRouter = null;

// 전역 라우터 설정
export function setupRouter(router) {
  globalRouter = router;
  // 전역 navigate 함수 등록
  window.navigateTo = (path, options) => router.navigate(path, options);
  window.router = router;
}

// 현재 라우터 가져오기
export function getRouter() {
  return globalRouter;
}

// 유틸리티 함수들
export const useNavigate = () => {
  return (path, options) => {
    if (globalRouter) {
      globalRouter.navigate(path, options);
    }
  };
};

export const useParams = () => {
  return globalRouter?.getCurrentRoute()?.params || {};
};

export const useLocation = () => {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
  };
};

// URL 쿼리 파라미터 유틸리티 함수들
export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};

  for (const [key, value] of params.entries()) {
    result[key] = decodeURIComponent(value);
  }

  return result;
};

export const updateQueryParams = (params, options = {}) => {
  const { replace = false } = options;
  const currentParams = new URLSearchParams(window.location.search);

  // 새로운 파라미터 업데이트
  Object.entries(params).forEach(([key, value]) => {
    if (value === "" || value === null || value === undefined) {
      currentParams.delete(key);
    } else {
      currentParams.set(key, encodeURIComponent(value));
    }
  });

  const newUrl = `${window.location.pathname}${currentParams.toString() ? `?${currentParams.toString()}` : ""}`;

  if (replace) {
    window.history.replaceState({}, "", newUrl);
  } else {
    window.history.pushState({}, "", newUrl);
  }
};
