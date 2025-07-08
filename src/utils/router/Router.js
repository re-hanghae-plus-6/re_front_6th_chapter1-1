import { pathMatcher } from "./pathMatcher";
import { parameterExtractor } from "./parameterExtractor";

const ROOT_PATH = "/";

class Router {
  #routes = {};

  constructor(routes = {}, options = {}) {
    // 기본값으로 기본 구현체 사용, 필요시 주입 가능
    this.pathMatcher = options.pathMatcher || pathMatcher;
    this.parameterExtractor = options.parameterExtractor || parameterExtractor;

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
      // 현재 경로와 파라미터 상태 업데이트
      this.currentPath = matchedPattern;
      this.currentParams = this.parameterExtractor.extract(matchedPattern, currentPath);

      return this.#routes[matchedPattern];
    }

    return null;
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

    const { replace = false } = options;

    if (replace) {
      window.history.replaceState(null, "", path);
    } else {
      window.history.pushState(null, "", path);
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
    }
  }

  getParams({ path }) {
    if (this.currentPath === path) {
      return this.currentParams;
    }
    return {};
  }

  isRootPath(path) {
    return path === ROOT_PATH;
  }
}

export default Router;
