export class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;

    // 환경에 따른 base path 설정
    this.basePath = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

    // 브라우저 뒤로가기/앞으로가기 이벤트 처리
    window.addEventListener("popstate", () => {
      this.handleRouteChange(this.getRelativePath(location.pathname), false);
    });
  }

  // 절대 경로에서 base path를 제거하여 상대 경로 반환
  getRelativePath(absolutePath) {
    if (this.basePath && absolutePath.startsWith(this.basePath)) {
      return absolutePath.slice(this.basePath.length) || "/";
    }
    return absolutePath;
  }

  // 상대 경로에 base path를 추가하여 절대 경로 반환
  getAbsolutePath(relativePath) {
    return this.basePath + relativePath;
  }

  // 라우트 등록
  addRoute(path, handler) {
    this.routes.set(path, handler);
  }

  // URL 변경 및 페이지 렌더링
  navigate(path, pushState = true) {
    if (pushState) {
      const absolutePath = this.getAbsolutePath(path);
      history.pushState(null, "", absolutePath);
    }
    this.handleRouteChange(path);
  }

  // 라우트 변경 처리
  handleRouteChange(path, pushState = true) {
    this.currentRoute = path;

    // 정확히 매칭되는 라우트 찾기
    if (this.routes.has(path)) {
      this.routes.get(path)();
      return;
    }

    // 동적 라우트 매칭 (/product/123 형태)
    for (const [routePath, handler] of this.routes) {
      const match = this.matchRoute(routePath, path);
      if (match) {
        handler(match.params);
        return;
      }
    }

    // 404 처리 - 404 라우트가 등록되어 있는지 확인
    if (this.routes.has("404")) {
      if (pushState) {
        const absolutePath = this.getAbsolutePath(path);
        history.pushState(null, "", absolutePath);
      }
      this.routes.get("404")();
      return;
    }

    // 404 라우트가 없으면 홈으로 리다이렉트
    console.warn("Route not found:", path);
    this.navigate("/", false);
  }

  // 라우트 매칭 로직
  matchRoute(routePath, actualPath) {
    const routeParts = routePath.split("/");
    const actualParts = actualPath.split("/");

    if (routeParts.length !== actualParts.length) {
      return null;
    }

    const params = {};

    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const actualPart = actualParts[i];

      if (routePart.startsWith(":")) {
        // 동적 파라미터
        const paramName = routePart.slice(1);
        params[paramName] = actualPart;
      } else if (routePart !== actualPart) {
        // 정확히 매칭되지 않으면 false
        return null;
      }
    }

    return { params };
  }

  // 현재 경로 반환
  getCurrentPath() {
    return this.currentRoute || this.getRelativePath(location.pathname);
  }
}

// 전역 라우터 인스턴스
export const router = new Router();
