import { pathMatcher } from "./pathMatcher";
import { parameterExtractor } from "./parameterExtractor";
import { searchParamsManager } from "../SearchParamsManager";

const ROOT_PATH = "/";

class Router {
  #routes = {};

  constructor(routes = {}, options = {}) {
    this.pathMatcher = options.pathMatcher || pathMatcher;
    this.parameterExtractor = options.parameterExtractor || parameterExtractor;

    this.fallback = options.fallback || null;

    this.searchParams = searchParamsManager;

    this.addRoute(routes);

    this.currentPath = null;
    this.currentParams = {};

    window.addEventListener("popstate", this.handlePopState.bind(this));
  }

  getInitialRoute() {
    const currentPath = window.location.pathname;
    const patterns = Object.keys(this.#routes);
    const matchedPattern = this.pathMatcher.findMatchedPattern(currentPath, patterns);

    if (matchedPattern) {
      this.currentPath = matchedPattern;
      this.currentParams = this.parameterExtractor.extract(matchedPattern, currentPath);

      return this.#routes[matchedPattern];
    }

    return {
      path: null,
      view: this.fallback,
    };
  }

  addRoute({ path, view, children }) {
    if (children == null) {
      this.#routes[path] = {
        path,
        view,
      };
      return;
    }

    if (!Array.isArray(children)) {
      throw new Error("children must be an array");
    }

    this.#routes[path] = {
      path,
      view,
    };

    for (const child of children) {
      this.addRoute({
        ...child,
        path: this.isRootPath(path) ? child.path : `${path}${child.path}`,
      });
    }
  }

  navigate(path, options = {}) {
    if (path === -1) {
      window.history.back();
      return;
    }

    const { replace = false, searchParams } = options;

    let fullURL = path;
    if (searchParams) {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value != null) {
          params.set(key, value);
        }
      });
      fullURL = params.toString() ? `${path}?${params.toString()}` : path;
    }

    if (replace) {
      window.history.replaceState(null, "", fullURL);
    } else {
      window.history.pushState(null, "", fullURL);
    }

    this.handlePopState();
  }

  handlePopState(event) {
    const actualPath = event?.state?.path || window.location.pathname || ROOT_PATH;
    const patterns = Object.keys(this.#routes);
    const matchedPattern = this.pathMatcher.findMatchedPattern(actualPath, patterns);

    if (matchedPattern) {
      this.currentPath = matchedPattern;
      this.currentParams = this.parameterExtractor.extract(matchedPattern, actualPath);

      const route = this.#routes[matchedPattern];

      // TODO: root와의 강결합 끊기, 렌더 로직을 component로 넘기기
      const container = document.getElementById("root");
      container.innerHTML = route.view();
    } else if (this.fallback) {
      this.currentPath = null;
      this.currentParams = {};

      const container = document.getElementById("root");
      container.innerHTML = this.fallback.view();
    }
  }

  getParams({ path }) {
    if (this.currentPath === path) {
      return this.currentParams;
    }
    return {};
  }

  getSearchParams() {
    return this.searchParams.getParams();
  }

  updateSearchParams(params, options = {}) {
    this.searchParams.updateParams(params, options);
  }

  subscribeSearchParams(key, callback) {
    return this.searchParams.subscribe(key, callback);
  }

  unsubscribeSearchParams(key, callback) {
    this.searchParams.unsubscribe(key, callback);
  }

  isRootPath(path) {
    return path === ROOT_PATH;
  }
}

export default Router;
