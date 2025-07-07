/**
 * @typedef {Object} RouteConfig
 * @property {string} path - 라우트 경로 (예: '/product/:id')
 * @property {Function} component - 컴포넌트 함수
 * @property {Function} [loader] - 데이터 로딩 함수
 */

/**
 * @typedef {Object} RouteMatch
 * @property {RouteConfig} route - 매칭된 라우트
 * @property {Object} params - URL 파라미터
 * @property {string} pathname - 현재 경로
 * @property {any} [data] - 로더에서 반환된 데이터
 */

/**
 * SPA 라우터 클래스
 * React Router와 유사한 기능을 제공하는 바닐라 자바스크립트 라우터
 */
class Router {
  constructor() {
    this.routes = [];
    this.currentRoute = null;
    this.listeners = new Set();
    this._isDestroyed = false;
    this._boundHandlePopState = this._handlePopState.bind(this);

    // popstate 이벤트 리스너 등록
    window.addEventListener("popstate", this._boundHandlePopState);
  }

  /**
   * 라우트를 등록합니다
   * @param {string} path - 라우트 경로
   * @param {Function} component - 컴포넌트 함수
   * @param {Function} [loader] - 데이터 로딩 함수
   */
  addRoute(path, component, loader = null) {
    if (this._isDestroyed) {
      console.warn("Router is destroyed. Cannot add route.");
      return;
    }

    this.routes.push({
      path,
      component,
      loader,
      // 경로를 정규식으로 변환하여 파라미터 매칭
      regex: this._pathToRegex(path),
      paramNames: this._extractParamNames(path),
    });
  }

  /**
   * 경로를 정규식으로 변환
   * @private
   */
  _pathToRegex(path) {
    // /product/:id -> /product/([^/]+)
    const regexPath = path
      .replace(/:\w+/g, "([^/]+)") // :id -> ([^/]+)
      .replace(/\//g, "\\/") // / -> \/
      .replace(/\*/g, ".*"); // * -> .*

    return new RegExp(`^${regexPath}$`);
  }

  /**
   * 파라미터 이름 추출
   * @private
   */
  _extractParamNames(path) {
    const matches = path.match(/:(\w+)/g);
    return matches ? matches.map((match) => match.slice(1)) : [];
  }

  /**
   * 현재 경로와 라우트 매칭
   * @param {string} pathname - 경로명
   * @returns {RouteMatch|null} 매칭 결과
   */
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

  /**
   * popstate 이벤트 핸들러
   * @private
   */
  _handlePopState() {
    if (!this._isDestroyed) {
      this.handleRouteChange();
    }
  }

  /**
   * 라우트 변경 처리
   */
  async handleRouteChange() {
    if (this._isDestroyed) return;

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
    this._notifyListeners();
  }

  /**
   * 프로그래밍 방식 네비게이션
   * @param {string} path - 이동할 경로
   * @param {Object} [options] - 네비게이션 옵션
   * @param {boolean} [options.replace=false] - 히스토리 교체 여부
   */
  navigate(path, options = {}) {
    if (this._isDestroyed) {
      console.warn("Router is destroyed. Cannot navigate.");
      return;
    }

    const { replace = false } = options;

    if (replace) {
      window.history.replaceState({}, "", path);
    } else {
      window.history.pushState({}, "", path);
    }

    this.handleRouteChange();
  }

  /**
   * 라우트 변경 리스너 등록
   * @param {Function} listener - 리스너 함수
   * @returns {Function} 구독 해제 함수
   */
  subscribe(listener) {
    if (this._isDestroyed) {
      console.warn("Router is destroyed. Cannot subscribe.");
      return () => {};
    }

    this.listeners.add(listener);

    // 구독 해제 함수 반환
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * 리스너들에게 알림
   * @private
   */
  _notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentRoute);
      } catch (error) {
        console.error("Router listener error:", error);
      }
    });
  }

  /**
   * 현재 라우트 정보 반환
   * @returns {RouteMatch|null}
   */
  getCurrentRoute() {
    return this.currentRoute;
  }

  /**
   * 라우터 초기화
   */
  async init() {
    if (this._isDestroyed) {
      console.warn("Router is destroyed. Cannot initialize.");
      return;
    }
    await this.handleRouteChange();
  }

  /**
   * 다수의 라우트를 한 번에 등록
   * @param {RouteConfig[]} routes - 라우트 배열
   */
  addRoutes(routes) {
    if (!Array.isArray(routes)) return;

    routes.forEach((route) => {
      if (!route || !route.path) return;
      // 사용자가 view 라는 키를 사용했을 수도 있으므로 호환 처리
      const component = route.component || route.view;
      const loader = route.loader || null;
      this.addRoute(route.path, component, loader);
    });
  }

  /**
   * 라우터 리소스 정리
   * 메모리 누수 방지를 위해 호출
   */
  destroy() {
    this._isDestroyed = true;
    window.removeEventListener("popstate", this._boundHandlePopState);
    this.listeners.clear();
    this.routes = [];
    this.currentRoute = null;
  }
}

/**
 * 라우터 인스턴스 생성 함수
 * @returns {Router}
 */
export function createRouter() {
  return new Router();
}

/**
 * 간단한 routes 배열로 라우터를 초기화하는 헬퍼
 * @param {RouteConfig[]} routes - 라우트 배열
 * @returns {Router}
 */
export function createSimpleRouter(routes) {
  const router = new Router();
  router.addRoutes(routes);
  return router;
}

// 전역 라우터 인스턴스
let globalRouter = null;

/**
 * 전역 라우터 설정
 * @param {Router} router - 라우터 인스턴스
 */
export function setupRouter(router) {
  // 이전 라우터 정리
  if (globalRouter) {
    globalRouter.destroy();
  }

  globalRouter = router;

  // 전역 navigate 함수 등록 (개선된 방식)
  if (!window.navigateTo) {
    window.navigateTo = (path, options) => {
      if (globalRouter && !globalRouter._isDestroyed) {
        globalRouter.navigate(path, options);
      }
    };
  }

  // 디버깅용 - 프로덕션에서는 제거 권장
  if (process.env.NODE_ENV !== "production") {
    window.router = router;
  }
}

/**
 * 현재 라우터 가져오기
 * @returns {Router|null}
 */
export function getRouter() {
  return globalRouter;
}

/**
 * 라우터 정리 함수
 */
export function cleanupRouter() {
  if (globalRouter) {
    globalRouter.destroy();
    globalRouter = null;
  }

  if (window.navigateTo) {
    delete window.navigateTo;
  }

  if (window.router) {
    delete window.router;
  }
}

// 유틸리티 함수들
/**
 * 네비게이션 훅 (React의 useNavigate와 유사)
 * @returns {Function}
 */
export const useNavigate = () => {
  return (path, options) => {
    if (globalRouter && !globalRouter._isDestroyed) {
      globalRouter.navigate(path, options);
    }
  };
};

/**
 * 파라미터 훅 (React의 useParams와 유사)
 * @returns {Object}
 */
export const useParams = () => {
  return globalRouter?.getCurrentRoute()?.params || {};
};

/**
 * 위치 훅 (React의 useLocation과 유사)
 * @returns {Object}
 */
export const useLocation = () => {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
  };
};

// URL 쿼리 파라미터 유틸리티 함수들
/**
 * 쿼리 파라미터를 객체로 변환
 * @returns {Object}
 */
export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};

  for (const [key, value] of params.entries()) {
    result[key] = decodeURIComponent(value);
  }

  return result;
};

/**
 * 쿼리 파라미터 업데이트
 * @param {Object} params - 업데이트할 파라미터
 * @param {Object} [options] - 옵션
 * @param {boolean} [options.replace=false] - 히스토리 교체 여부
 */
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

// 페이지 언로드 시 자동 정리
window.addEventListener("beforeunload", () => {
  cleanupRouter();
});
