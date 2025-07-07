import routes from "./routes.js";

class Router {
  constructor(container) {
    this.container = container;
    this.routes = {};
    this.initRoutes();
  }

  initRoutes() {
    routes.forEach((route) => {
      this.routes[route.path] = route.handler;
    });
  }

  init() {
    window.addEventListener("popstate", () => {
      this.render(window.location.pathname);
    });

    this.render(window.location.pathname);
  }

  navigate(path) {
    history.pushState(null, "", path);
    this.render(path);
  }

  updateQuery(key, value) {
    const url = new URL(window.location);
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }

    const newUrl = url.pathname + url.search;
    history.pushState(null, "", newUrl);
    this.render();
  }

  getCurrentRoute() {
    const url = new URL(window.location);
    const path = url.pathname;
    const query = {};

    for (const [key, value] of url.searchParams) {
      console.log("key: ", key, "value: ", value);
      query[key] = value;
    }

    return { path, query };
  }

  findRoute(path) {
    if (this.routes[path]) {
      return { route: path, params: {} };
    }

    for (const routePath in this.routes) {
      if (routePath.includes(":")) {
        const routeParts = routePath.split("/");
        const pathParts = path.split("/");

        if (routeParts.length === pathParts.length) {
          const params = {};
          let isMatch = true;

          for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(":")) {
              const paramName = routeParts[i].slice(1);
              params[paramName] = pathParts[i];
            } else if (routeParts[i] !== pathParts[i]) {
              isMatch = false;
              break;
            }
          }

          if (isMatch) {
            return { route: routePath, params };
          }
        }
      }
    }

    return null;
  }

  async render(path) {
    if (!path) {
      path = window.location.pathname;
    }

    const result = this.findRoute(path);

    if (result) {
      const component = this.routes[result.route];
      const { query } = this.getCurrentRoute();
      const params = { ...result.params, ...query };
      await component(this.container, params);
    } else {
      const notFoundHandler = this.routes["*"];
      if (notFoundHandler) {
        await notFoundHandler(this.container);
      } else {
        this.container.innerHTML = "<h1>404 - 페이지를 찾을 수 없습니다!</h1>";
      }
    }
  }
}

export default Router;
