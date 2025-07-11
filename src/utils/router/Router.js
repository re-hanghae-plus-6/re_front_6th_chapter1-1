import { pathMatcher } from "./pathMatcher";
import { parameterExtractor } from "./parameterExtractor";
import { searchParamsManager } from "../SearchParamsManager";

const ROOT_PATH = "/";

class Router {
  #routes = {};

  constructor(routes = {}, options = {}) {
    // 기본값으로 기본 구현체 사용, 필요시 주입 가능
    this.pathMatcher = options.pathMatcher || pathMatcher;
    this.parameterExtractor = options.parameterExtractor || parameterExtractor;

    // fallback 페이지 설정 (매칭되는 라우트가 없을 때 사용)
    this.fallback = options.fallback || null;

    // SearchParamsManager 인스턴스 참조
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
      // 현재 경로와 파라미터 상태 업데이트
      this.currentPath = matchedPattern;
      this.currentParams = this.parameterExtractor.extract(matchedPattern, currentPath);

      return this.#routes[matchedPattern];
    }

    // 매칭되는 라우트가 없을 때 fallback 반환
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
      // 매칭되는 라우트가 없을 때 fallback 페이지 렌더링
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

  // 현재 search parameter 조회 (SearchParamsManager 위임)
  getSearchParams() {
    return this.searchParams.getParams();
  }

  // search parameter만 업데이트 (SearchParamsManager 위임)
  updateSearchParams(params, options = {}) {
    this.searchParams.updateParams(params, options);
  }

  // search parameter 변경 구독 (SearchParamsManager 위임)
  subscribeSearchParams(key, callback) {
    return this.searchParams.subscribe(key, callback);
  }

  // search parameter 구독 해제 (SearchParamsManager 위임)
  unsubscribeSearchParams(key, callback) {
    this.searchParams.unsubscribe(key, callback);
  }

  isRootPath(path) {
    return path === ROOT_PATH;
  }
}

export default Router;
