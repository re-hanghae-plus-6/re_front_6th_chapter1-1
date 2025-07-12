import { BASE } from "../main";

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

    // 기존 인스턴스가 있으면 unmount
    if (this.currentInstance && this.currentInstance.destroy) {
      this.currentInstance.destroy();
    }

    // 새 컴포넌트 인스턴스 생성
    const ComponentClass = route.component;

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

      const fullPath =
        BASE === "/" ? normalizedPathname : `${BASE.slice(0, -1)}${normalizedPathname}`;
      return `${fullPath}?${search}`;
    }

    // 쿼리스트링이 없는 경우
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return BASE === "/" ? normalizedPath : `${BASE.slice(0, -1)}${normalizedPath}`;
  }

  getCurrentPath() {
    const fullPath = window.location.pathname;

    if (BASE !== "/") {
      const baseWithoutSlash = BASE.slice(0, -1);

      if (fullPath.startsWith(baseWithoutSlash)) {
        return fullPath.slice(baseWithoutSlash.length) || "/";
      }
    }

    return fullPath;
  }

  parseQueryParams() {
    const oldQueryParams = { ...this.queryParams };
    this.queryParams = {};
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams) {
      this.queryParams[key] = value;
    }

    // 쿼리 파라미터가 변경되었는지 확인하고 이벤트 발생
    const hasChanged = JSON.stringify(oldQueryParams) !== JSON.stringify(this.queryParams);
    if (hasChanged) {
      this.dispatchQueryParamsChange();
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

    const relativePath = this.getCurrentPath();

    const fullPath = BASE === "/" ? relativePath : `${BASE.slice(0, -1)}${relativePath}`;

    url.pathname = fullPath;
    url.search = "";

    Object.entries(this.queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value.toString());
      }
    });

    // URL 업데이트 (히스토리 스택에 추가하지 않음)
    window.history.replaceState(null, "", url.toString());

    this.dispatchQueryParamsChange();
  }

  dispatchQueryParamsChange() {
    const event = new CustomEvent("queryParamsChange", {
      detail: { queryParams: { ...this.queryParams } },
    });
    window.dispatchEvent(event);
  }

  static getInstance() {
    return Router.instance || null;
  }
}
