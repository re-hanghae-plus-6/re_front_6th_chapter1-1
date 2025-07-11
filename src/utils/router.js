// BASE_PATH 설정
export const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

// 간결한 라우터
class Router {
  constructor() {
    this.routes = new Map();
    this.currentPath = "/";
    this.currentParams = {};
  }

  register(path, handler) {
    // BASE_PATH를 제외한 경로로 등록
    const cleanPath = this.removeBasePath(path);
    this.routes.set(cleanPath, handler);
    return this;
  }

  navigate(path, updateHistory = true) {
    // BASE_PATH를 제외한 경로로 처리
    const cleanPath = this.removeBasePath(path);
    this.currentPath = cleanPath || "/";

    if (updateHistory) {
      // 전체 경로(BASE_PATH 포함)로 history 업데이트
      const fullPath = this.addBasePath(cleanPath);
      history.pushState({}, "", fullPath);
    }

    const match = this.matchRoute(cleanPath);
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

  // BASE_PATH 제거 함수
  removeBasePath(path) {
    if (BASE_PATH && path.startsWith(BASE_PATH)) {
      return path.slice(BASE_PATH.length) || "/";
    }
    return path;
  }

  // BASE_PATH 추가 함수
  addBasePath(path) {
    if (BASE_PATH && path !== "/") {
      return `${BASE_PATH}${path}`;
    }
    return BASE_PATH + path;
  }

  init() {
    // 브라우저 뒤로가기/앞으로가기 처리
    window.addEventListener("popstate", () => {
      const currentPath = this.removeBasePath(location.pathname);
      this.navigate(currentPath, false);
    });

    // a 태그 클릭 이벤트 처리
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (link && this.shouldHandleLink(link)) {
        e.preventDefault();
        const href = link.getAttribute("href");
        this.navigate(href);
      }
    });

    // 초기 경로 처리 (BASE_PATH 제거 후)
    const initialPath = this.removeBasePath(location.pathname);
    this.navigate(initialPath, false);
    return this;
  }

  // 링크 처리 여부를 결정하는 메서드
  shouldHandleLink(link) {
    const href = link.getAttribute("href");
    if (!href) return false;

    // 외부 링크는 처리하지 않음
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return false;
    }

    // 현재 도메인의 링크만 처리
    return href.startsWith("/") || href.startsWith("./") || href.startsWith("../");
  }
}

// 전역 라우터 인스턴스
export const router = new Router();

// 편의 함수들
export const navigateTo = (path) => router.navigate(path);
export const getCurrentPath = () => router.getCurrentPath();
export const getCurrentParams = () => router.getCurrentParams();
