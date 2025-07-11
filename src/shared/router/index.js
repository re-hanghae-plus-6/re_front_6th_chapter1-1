// 경로 처리 유틸리티
const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

const getAppPath = (fullPath = window.location.pathname) => {
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
};

const getFullPath = (appPath) => {
  return BASE_PATH + appPath;
};

// 라우터 클래스
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.initialized = false;

    // 브라우저 뒤로가기/앞으로가기 이벤트 처리
    window.addEventListener("popstate", () => {
      const appPath = getAppPath(window.location.pathname);
      this.navigate(appPath, false);
    });
  }

  // 라우터 초기화 (라우트 등록 후 호출)
  init() {
    if (!this.initialized) {
      this.initialized = true;
      // 초기 라우트 설정 - 현재 URL에서 앱 경로 추출
      const appPath = getAppPath(window.location.pathname);
      this.navigate(appPath, false);
    }
  }

  // 라우트 등록
  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  // 페이지 이동
  navigate(appPath, pushState = true) {
    // URL 업데이트 (history API 사용) - 전체 경로로 변환
    if (pushState) {
      const fullPath = getFullPath(appPath);
      window.history.pushState({}, "", fullPath);
    }

    this.currentRoute = appPath;

    // 패턴 매칭으로 라우트 찾기
    const route = this.findRoute(appPath);
    if (route) {
      route.handler(route.params);
    } else {
      // 404 처리
      const notFoundHandler = this.routes["*"];
      if (notFoundHandler) {
        notFoundHandler();
      }
    }
  }

  // 라우트 패턴 매칭
  findRoute(path) {
    // 정확한 매치 우선 검사
    if (this.routes[path]) {
      return { handler: this.routes[path], params: {} };
    }

    // 파라미터가 있는 라우트 검사
    for (const routePath in this.routes) {
      if (routePath.includes(":")) {
        const params = this.matchRoute(routePath, path);
        if (params) {
          return { handler: this.routes[routePath], params };
        }
      }
    }

    return null;
  }

  // 라우트 패턴과 실제 경로 매칭
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
        // 파라미터 부분
        const paramName = routePart.slice(1);
        params[paramName] = actualPart;
      } else if (routePart !== actualPart) {
        // 정확히 일치하지 않으면 매칭 실패
        return null;
      }
    }

    return params;
  }

  // 현재 라우트 가져오기
  getCurrentRoute() {
    return this.currentRoute;
  }
}

// 라우터 인스턴스 생성 및 내보내기
export const router = new Router();

// 경로 처리 유틸리티 함수들도 export
export { getAppPath, getFullPath, BASE_PATH };
