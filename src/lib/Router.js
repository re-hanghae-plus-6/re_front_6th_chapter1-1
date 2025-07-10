export class Router {
  constructor(routes, rootElement) {
    this.routes = routes;
    this.rootElement = rootElement;
    this.queryParams = {};
    this.params = {};

    // 전역 라우터 인스턴스로 설정
    Router.instance = this;

    this.init();
  }

  init() {
    // popstate 이벤트 (뒤로/앞으로)
    window.addEventListener("popstate", () => {
      this.handleRouteChange();
    });

    this.handleRouteChange();
  }

  handleRouteChange() {
    // URL이 변경될 때마다 쿼리 파라미터와 경로 파라미터 파싱
    this.parseQueryParams();
    this.render();
  }

  render() {
    const route = this.getCurrentRoute();

    if (!route) {
      this.rootElement.innerHTML = `<h1>404 Not Found</h1>`;
      return;
    }

    // 기존 인스턴스가 있으면 unmount
    if (this.currentInstance?.unmount) {
      this.currentInstance.unmount();
    }

    // 새 컴포넌트 인스턴스 생성
    const ComponentClass = route.component;
    console.log("새 컴포넌트 생성:", ComponentClass.name);

    this.currentInstance = new ComponentClass(this.rootElement, {
      params: this.params,
      query: this.queryParams,
    });
  }

  navigate(to, replace = false) {
    // 경로 정규화: 쿼리스트링 앞의 / 제거
    const normalizedPath = this.normalizePath(to);

    if (replace) {
      window.history.replaceState(null, "", normalizedPath);
    } else {
      window.history.pushState(null, "", normalizedPath);
    }

    this.handleRouteChange();
  }

  // 경로 정규화: 쿼리스트링 앞의 / 제거
  normalizePath(path) {
    // 쿼리스트링이 있는 경우
    if (path.includes("?")) {
      const [pathname, search] = path.split("?");
      // pathname이 /로 시작하지 않으면 / 추가
      const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
      return `${normalizedPathname}?${search}`;
    }

    // 쿼리스트링이 없는 경우
    return path.startsWith("/") ? path : `/${path}`;
  }

  getCurrentPath() {
    return window.location.pathname;
  }

  /**
   * URL 쿼리 파라미터 파싱
   */
  parseQueryParams() {
    this.queryParams = {};
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams) {
      this.queryParams[key] = value;
    }
  }

  getCurrentRoute() {
    const path = this.getCurrentPath();

    // 정확한 경로 매칭 먼저 시도
    const exactRoute = this.routes.find((route) => route.path === path);

    if (exactRoute) {
      this.params = {}; // 정적 라우트는 params 없음
      return exactRoute;
    }

    // 동적 라우트 (예: /product/:id)
    const dynamicRoute = this.routes.find((route) => {
      if (route.path.includes(":")) {
        const routeSegments = route.path.split("/");
        const pathSegments = path.split("/");

        if (routeSegments.length !== pathSegments.length) {
          return false;
        }

        const isMatch = routeSegments.every((segment, index) => {
          if (segment.startsWith(":")) return true;
          return segment === pathSegments[index];
        });

        if (isMatch) {
          // 파라미터 추출
          this.params = {};
          routeSegments.forEach((segment, index) => {
            if (segment.startsWith(":")) {
              const paramName = segment.substring(1);
              this.params[paramName] = pathSegments[index];
            }
          });
          return true;
        }
      }
      return false;
    });

    if (dynamicRoute) {
      return dynamicRoute;
    }

    // 와일드카드 (*)
    const wildcardRoute = this.routes.find((route) => route.path === "*");
    return wildcardRoute || null;
  }

  getCurrentComponent() {
    const route = this.getCurrentRoute();
    return route.component;
  }

  getParams(key) {
    if (key) {
      return this.params[key];
    }
    return { ...this.params };
  }

  setParam(key, value) {
    this.params[key] = value;
  }

  setParams(params) {
    this.params = params;
  }

  getQueryParams(key) {
    if (key) {
      return this.queryParams[key];
    }
    return { ...this.queryParams };
  }

  setQueryParam(key, value) {
    console.log("setQueryParam", key, value);

    // 값이 없거나 빈 문자열이면 파라미터 제거
    if (value === undefined || value === null || value === "") {
      delete this.queryParams[key];
    } else {
      this.queryParams[key] = value;
    }

    // URL 업데이트
    this.updateURL();
  }

  setQueryParams(queryParams) {
    // 기존 파라미터 모두 제거
    Object.keys(this.queryParams).forEach((key) => {
      delete this.queryParams[key];
    });

    // 새 파라미터 설정
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        this.queryParams[key] = value;
      }
    });

    // URL 업데이트
    this.updateURL();
  }

  updateURL() {
    const url = new URL(window.location);

    url.search = "";

    Object.entries(this.queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value.toString());
      }
    });

    // URL 업데이트 (히스토리 스택에 추가하지 않음)
    window.history.replaceState(null, "", url.toString());
    console.log("URL 업데이트됨:", url.toString());
  }

  static getInstance() {
    return Router.instance || null;
  }
}
