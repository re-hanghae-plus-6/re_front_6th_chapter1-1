import { getFullPath, getRelativePath } from "../utils/config.js";

/**
 * React Router와 비슷한 SPA 라우터
 */
export class Router {
  constructor() {
    this.routes = [];
    this.currentRoute = null;
    this.listeners = [];
    this.isNavigating = false;

    // 초기 라우트 설정
    this.init();
  }

  /**
   * 라우터 초기화
   */
  init() {
    // popstate 이벤트 리스너 등록
    window.addEventListener("popstate", this.handlePopState.bind(this));

    // 초기 라우트 매칭은 수동으로 호출해야 함
    // this.handleRouteChange(); // 제거: 중복 호출 방지
  }

  /**
   * 라우터 등록
   */
  addRoute(path, component, options = {}) {
    this.routes.push({
      path,
      component,
      exact: options.exact !== false, // 기본값은 true
      ...options,
    });
  }

  /**
   * 여러 라우트 한번에 등록
   */
  addRoutes(routes) {
    routes.forEach((route) => {
      this.addRoute(route.path, route.component, route.options);
    });
  }

  /**
   * 현재 URL과 매칭되는 라우트 찾기
   */
  matchRoute(pathname = window.location.pathname) {
    const relativePath = getRelativePath(pathname);
    for (const route of this.routes) {
      if (this.isRouteMatch(relativePath, route)) {
        return route;
      }
    }
    return null;
  }

  /**
   * 라우트 매칭 검사
   */
  isRouteMatch(pathname, route) {
    if (route.exact) {
      return pathname === route.path;
    }
    return pathname.startsWith(route.path);
  }

  /**
   * 페이지 이동
   */
  navigate(path, options = {}) {
    if (this.isNavigating) return;

    const { replace = false, state = null } = options;
    const fullPath = getFullPath(path);

    // 현재 경로와 같으면 무시
    if (window.location.pathname === fullPath) return;

    this.isNavigating = true;

    try {
      // 히스토리 업데이트
      if (replace) {
        window.history.replaceState(state, "", fullPath);
      } else {
        window.history.pushState(state, "", fullPath);
      }

      // 라우트 매칭 및 렌더링
      this.handleRouteChange();
    } finally {
      this.isNavigating = false;
    }
  }

  /**
   * 뒤로가기
   */
  goBack() {
    window.history.back();
  }

  /**
   * 앞으로가기
   */
  goForward() {
    window.history.forward();
  }

  /**
   * popstate 이벤트 핸들러
   */
  handlePopState() {
    if (this.isNavigating) return;
    this.handleRouteChange();
  }

  /**
   * 라우트 매칭 및 컴포넌트 렌더링
   */
  handleRouteChange() {
    const pathname = window.location.pathname;
    const route = this.matchRoute(pathname);

    if (route) {
      this.currentRoute = route;
      this.renderComponent(route);
    } else {
      this.render404();
    }

    // 리스너들에게 라우트 변경 알림
    this.notifyListeners(route);
  }

  /**
   * 컴포넌트 렌더링
   */
  renderComponent(route) {
    const root = document.getElementById("root");
    if (root && route.component) {
      // 컴포넌트가 함수인 경우 실행
      if (typeof route.component === "function") {
        const content = route.component();
        root.innerHTML = content;
      } else {
        root.innerHTML = route.component;
      }
    }
  }

  /**
   * 404 페이지 렌더링
   */
  render404() {
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = `
        <main class="max-w-md mx-auto px-4 py-4">
          <div class="text-center my-4 py-20 shadow-md p-6 bg-white rounded-lg">
          <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#4285f4;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#1a73e8;stop-opacity:1" />
              </linearGradient>
              <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="8" flood-color="#000000" flood-opacity="0.1"/>
              </filter>
            </defs>
            <text x="160" y="85" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="48" font-weight="600" fill="url(#blueGradient)" text-anchor="middle">404</text>
            <circle cx="80" cy="60" r="3" fill="#e8f0fe" opacity="0.8"/>
            <circle cx="240" cy="60" r="3" fill="#e8f0fe" opacity="0.8"/>
            <circle cx="90" cy="45" r="2" fill="#4285f4" opacity="0.5"/>
            <circle cx="230" cy="45" r="2" fill="#4285f4" opacity="0.5"/>
            <text x="160" y="110" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" font-weight="400" fill="#5f6368" text-anchor="middle">페이지를 찾을 수 없습니다</text>
            <rect x="130" y="130" width="60" height="2" rx="1" fill="url(#blueGradient)" opacity="0.3"/>
          </svg>
          <a href="/" data-link class="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">홈으로</a>
        </div>
        </main>
      `;
    }
  }

  /**
   * 라우트 변경 리스너 등록
   */
  addListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * 라우트 변경 리스너 제거
   */
  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  /**
   * 리스너들에게 라우트 변경 알림
   */
  notifyListeners(route) {
    this.listeners.forEach((listener) => {
      try {
        listener(route);
      } catch (error) {
        console.error("Router listener error:", error);
      }
    });
  }

  /**
   * 현재 라우트 정보 반환
   */
  getCurrentRoute() {
    return this.currentRoute;
  }

  /**
   * 현재 경로 반환
   */
  getCurrentPath() {
    return getRelativePath(window.location.pathname);
  }
}

// 전역 라우터 인스턴스
export const router = new Router();

// 전역에서 사용할 수 있도록 window 객체에 추가
window.router = router;
