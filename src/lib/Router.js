export class Router {
  constructor(routes, rootElement) {
    this.routes = routes;
    this.rootElement = rootElement;
    this.queryParams = {};
    this.params = {};

    this.init();
  }

  init() {
    // * popstate 이벤트 감지 (뒤로가기/앞으로가기)
    window.addEventListener("popstate", () => {
      this.handleRouteChange();
    });

    this.handleRouteChange();
  }

  handleRouteChange() {
    this.render();
  }

  render() {
    const route = this.getCurrentRoute();

    this.rootElement.innerHTML = route.component();
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

  getCurrentRoute() {
    const path = this.getCurrentPath();

    const exactRoute = this.routes.find((route) => route.path === path);

    if (exactRoute) {
      return exactRoute;
    }

    // 동적 라우트 매칭 (예: /product/:id)
    const dynamicRoute = this.routes.find((route) => {
      if (route.path.includes(":")) {
        const routeSegments = route.path.split("/");
        const pathSegments = path.split("/");

        if (routeSegments.length !== pathSegments.length) {
          return false;
        }

        // 모든 세그먼트가 매칭되는지 확인
        const isMatch = routeSegments.every((segment, index) => {
          if (segment.startsWith(":")) {
            return true; // 동적 파라미터는 어떤 값이든 매칭
          }
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

    // 와일드카드 라우트 (*) 찾기
    const wildcardRoute = this.routes.find((route) => route.path === "*");
    return wildcardRoute || null;
  }

  getCurrentComponent() {
    const route = this.getCurrentRoute();

    if (!route) {
      return this.get404Page();
    }

    return route.component;
  }
}
