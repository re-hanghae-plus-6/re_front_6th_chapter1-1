class Router {
  constructor() {
    this.routes = [];
    this.notFoundHandler = null;

    // BASE_PATH 설정 (프로덕션 환경에서 서브패스 지원)
    this.BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

    // 브라우저 뒤로가기/앞으로가기 처리
    window.addEventListener("popstate", () => {
      const appPath = this.getAppPath(window.location.pathname);
      this.handle(appPath);
    });
  }

  // 전체 경로에서 앱 경로 추출
  getAppPath(fullPath = window.location.pathname) {
    return fullPath.startsWith(this.BASE_PATH) ? fullPath.slice(this.BASE_PATH.length) || "/" : fullPath;
  }

  // 앱 경로를 전체 경로로 변환
  getFullPath(appPath) {
    return this.BASE_PATH + appPath;
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
  navigate(appPath) {
    const currentAppPath = this.getAppPath();
    if (currentAppPath === appPath) return;

    const fullPath = this.getFullPath(appPath);
    history.pushState({}, "", fullPath);
    this.handle(appPath);
  }

  // 현재 경로 처리 (앱 경로 기준)
  handle(appPath) {
    for (const { pattern, handler } of this.routes) {
      const params = this.match(pattern, appPath);
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

  // 현재 앱 경로 가져오기
  getCurrentAppPath() {
    return this.getAppPath();
  }

  // 현재 전체 경로 가져오기
  getCurrentFullPath() {
    return window.location.pathname;
  }
}

// 싱글톤 인스턴스 export
const router = new Router();
export default router;
