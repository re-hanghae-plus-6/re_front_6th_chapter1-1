class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.notFoundHandler = null;

    window.addEventListener("popstate", () => this.handleRouteChange());
  }

  addRoute(path, handler) {
    this.routes.set(path, handler);
  }

  setNotFoundHandler(handler) {
    this.notFoundHandler = handler;
  }

  getCurrentPath() {
    return window.location.pathname;
  }

  async handleRouteChange() {
    const currentPath = this.getCurrentPath();

    if (this.routes.has(currentPath)) {
      const handler = this.routes.get(currentPath);
      this.currentRoute = currentPath;
      await handler();
      return;
    }

    for (const [routePath, handler] of this.routes.entries()) {
      const params = this.matchRoute(routePath, currentPath);
      if (params) {
        this.currentRoute = routePath;
        await handler(params);
        return;
      }
    }

    if (this.notFoundHandler) {
      await this.notFoundHandler();
    }
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
        const paramName = routePart.slice(1);
        params[paramName] = currentPart;
      } else if (routePart !== currentPart) {
        return null;
      }
    }

    return params;
  }

  navigate(path) {
    window.history.pushState({}, "", path);
    this.handleRouteChange();
  }

  start() {
    this.handleRouteChange();
  }
}

export const router = new Router();
