export class Router {
  #routes;
  #route;
  #baseUrl;
  #listeners;

  constructor(baseUrl = "") {
    this.#routes = new Map();
    this.#route = null;
    this.#baseUrl = baseUrl.replace(/\/+$/, "");
    this.#listeners = new Set();

    window.addEventListener("popstate", () => {
      this.#route = this.#findRoute();
      this.notify();
    });
  }

  get baseUrl() {
    return this.#baseUrl;
  }
  get route() {
    return this.#route;
  }

  get target() {
    return this.#route?.handler;
  }

  subscribe(callback) {
    this.#listeners.add(callback);
    // 구독 해제 함수 반환
    return () => this.#listeners.delete(callback);
  }
  // 라우트 등록
  addRoute(path, handler) {
    const paramsNames = [];
    const regexPath = path
      .replace(/:\w+/g, match => {
        paramsNames.push(match.slice(1));
        return "([^/]+)";
      })
      .replace(/\//g, "\\/");
    const regex = new RegExp(`^${this.#baseUrl}${regexPath}`);
    this.#routes.set(path, {
      regex,
      paramsNames,
      handler,
    });
  }

  #findRoute(url = window.location.pathname) {
    const { pathname } = new URL(url, window.location.origin);
    for (const [path, route] of this.#routes) {
      const match = pathname.match(route.regex);
      if (match) {
        const matchParams = {};
        route.paramsNames.forEach((param, index) => {
          matchParams[param] = match[index + 1];
        });
        return { ...route, params: matchParams, path };
      }
    }
    return null;
  }

  start() {
    this.#route = this.#findRoute();
    this.notify();
  }

  navigate(path, state) {
    window.history.pushState(state, "", path);
    this.#route = this.#findRoute(path);
    this.notify(this.#route);
  }

  notify() {
    this.#listeners.forEach(callback => callback());
  }
}
