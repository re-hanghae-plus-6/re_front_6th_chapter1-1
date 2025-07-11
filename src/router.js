import NotFound from "./components/NotFound.js";

class Router {
  constructor(routes, rootElement) {
    this.routes = routes;
    this.rootElement = rootElement;
    this.currentState = null;

    // 브라우저 뒤로가기/앞으로가기 지원
    window.addEventListener("popstate", () => {
      this.handleRoute();
    });

    // 초기 라우트 처리
    this.handleRoute();
  }

  async navigate(path) {
    window.history.pushState({}, "", path);
    await this.handleRoute();
  }

  async handleRoute() {
    const path = window.location.pathname;
    const route = this.findRoute(path);

    if (route) {
      const { component, params } = route;
      await this.renderPage(component, params);
    } else {
      // 404 처리
      this.render404();
    }
  }

  findRoute(path) {
    // 정확한 매치 먼저 확인
    if (this.routes[path]) {
      return {
        component: this.routes[path],
        params: {},
      };
    }

    // 동적 라우트 확인 (예: /product/:id)
    for (const routePath in this.routes) {
      const route = this.routes[routePath];
      const match = this.matchRoute(routePath, path);

      if (match) {
        return {
          component: route,
          params: match,
        };
      }
    }

    return null;
  }

  matchRoute(routePath, currentPath) {
    const routeParts = routePath.split("/");
    const currentParts = currentPath.split("/");

    if (routeParts.length !== currentParts.length) {
      return null;
    }

    const params = {};

    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const currentPart = currentParts[i];

      if (routePart.startsWith(":")) {
        // 동적 파라미터
        const paramName = routePart.slice(1);
        params[paramName] = currentPart;
      } else if (routePart !== currentPart) {
        // 정적 경로가 일치하지 않음
        return null;
      }
    }

    return params;
  }

  async renderPage(component, params) {
    if (typeof component === "function") {
      try {
        const result = await component(params, this.currentState);
        this.rootElement.innerHTML = result;

        // 페이지 렌더링 후 스크롤을 맨 위로 이동
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("페이지 렌더링 중 오류:", error);
        NotFound();
      }
    }
  }

  render404() {
    this.rootElement.innerHTML = `
      ${NotFound()}
    `;
  }

  async setState(state) {
    this.currentState = state;
    // 현재 페이지 다시 렌더링
    await this.handleRoute();
  }
}

export default Router;
