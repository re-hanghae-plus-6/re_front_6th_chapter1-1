class Router {
  constructor() {
    this.routes = [];
    this.notFoundHandler = null;

    // 브라우저 뒤로가기/앞으로가기 처리
    window.addEventListener("popstate", () => {
      this.handle(window.location.pathname);
    });
  }

  // 라우트 등록: 패턴(예: '/product/:id')과 핸들러 함수
  add(pattern, handler) {
    this.routes.push({ pattern, handler });
  }

  // 404(매칭 안됨) 핸들러 등록
  setNotFound(handler) {
    this.notFoundHandler = handler;
  }

  // 내비게이션 (pushState 후 핸들)
  navigate(path) {
    if (window.location.pathname === path) return;
    history.pushState({}, "", path);
    this.handle(path);
  }

  // 현재 경로 처리
  handle(path) {
    for (const { pattern, handler } of this.routes) {
      const params = this.match(pattern, path);
      if (params) {
        handler(params);
        return;
      }
    }
    // 매칭 실패 시 notFound
    if (this.notFoundHandler) this.notFoundHandler();
  }

  // 패턴 매칭 (간단한 ':' 파라미터 지원)
  match(pattern, path) {
    const patternParts = pattern.split("/").filter(Boolean);
    const pathParts = path.split("/").filter(Boolean);

    if (patternParts.length !== pathParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      const pp = patternParts[i];
      const cp = pathParts[i];
      if (pp.startsWith(":")) {
        params[pp.slice(1)] = decodeURIComponent(cp);
      } else if (pp !== cp) {
        return null;
      }
    }
    return params;
  }
}

// 싱글톤 인스턴스 export
const router = new Router();
export default router;
