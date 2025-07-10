// 간결한 라우터
class Router {
  constructor() {
    this.routes = new Map();
    this.currentPath = "/";
    this.currentParams = {};
  }

  register(path, handler) {
    this.routes.set(path, handler);
    return this;
  }

  navigate(path, updateHistory = true) {
    this.currentPath = path || "/";

    if (updateHistory) {
      history.pushState({}, "", path);
    }

    const match = this.matchRoute(path);
    if (match) {
      this.currentParams = match.params;
      match.handler(match.params);
    } else {
      this.handle404();
    }
    return this;
  }

  matchRoute(path) {
    // 정확한 매칭
    if (this.routes.has(path)) {
      return { handler: this.routes.get(path), params: {} };
    }

    // 동적 라우트 매칭
    for (const [pattern, handler] of this.routes) {
      if (pattern.includes(":")) {
        const params = this.extractParams(pattern, path);
        if (params) {
          return { handler, params };
        }
      }
    }
    return null;
  }

  extractParams(pattern, path) {
    const patternParts = pattern.split("/");
    const pathParts = path.split("/");

    if (patternParts.length !== pathParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(":")) {
        params[patternParts[i].slice(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  }

  handle404() {
    const notFoundHandler = this.routes.get("/404");
    if (notFoundHandler) {
      this.currentParams = {};
      notFoundHandler();
    } else if (this.currentPath !== "/404") {
      this.navigate("/404", false);
    }
  }

  getCurrentPath() {
    return this.currentPath;
  }

  getCurrentParams() {
    return this.currentParams;
  }

  init() {
    // 브라우저 뒤로가기/앞으로가기 처리
    window.addEventListener("popstate", () => {
      this.navigate(location.pathname, false);
    });

    // 초기 경로 처리
    this.navigate(location.pathname, false);
    return this;
  }
}

// 전역 라우터 인스턴스
export const router = new Router();

// 편의 함수들
export const navigateTo = (path) => router.navigate(path);
export const getCurrentPath = () => router.getCurrentPath();
export const getCurrentParams = () => router.getCurrentParams();
