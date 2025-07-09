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

    this.currentInstance = new ComponentClass(this.rootElement, {
      params: this.params,
      query: this.queryParams,
    });
  }

  navigate(to, replace = false) {
    if (replace) {
      window.history.replaceState(null, "", to);
    } else {
      window.history.pushState(null, "", to);
    }

    this.handleRouteChange();
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

  getQueryParams(key) {
    if (key) {
      return this.queryParams[key];
    }
    return { ...this.queryParams };
  }

  static getInstance() {
    return Router.instance || null;
  }
}
