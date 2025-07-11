// URL 변화를 감지하고 라우팅을 처리하는 함수형 라우터

// GitHub Pages 배포를 위한 BASE_PATH 설정
const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

/**
 * 전체 경로에서 앱 경로를 추출하는 함수
 * @param {string} fullPath - 전체 경로 (기본값: 현재 pathname)
 * @returns {string} 앱 경로
 */
const getAppPath = (fullPath = window.location.pathname) => {
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
};

/**
 * 앱 경로를 전체 경로로 변환하는 함수
 * @param {string} appPath - 앱 경로
 * @returns {string} 전체 경로
 */
const getFullPath = (appPath) => {
  return BASE_PATH + appPath;
};

/**
 * 라우터 생성 함수
 * @param {Object} config - 라우터 설정
 * @param {Array} config.routes - 라우트 설정 배열
 * @param {Function} config.onNavigate - 네비게이션 콜백
 * @returns {Object} 라우터 객체
 */
export function createRouter(config = {}) {
  const { routes = [], onNavigate = () => {} } = config;

  // 현재 경로 상태 (초기값을 null로 설정하여 첫 로드 시 반드시 실행되도록)
  let currentPath = null;
  let currentQuery = null;

  /**
   * URL 변화를 감지하고 처리하는 핵심 함수
   */
  function handleLocationChange() {
    const newPath = getAppPath(); // BASE_PATH를 제거한 앱 경로 사용
    const newQuery = new URLSearchParams(window.location.search);

    // 경로나 쿼리가 변경된 경우에만 처리 (초기 로드는 항상 처리)
    if (currentPath === null || newPath !== currentPath || newQuery.toString() !== (currentQuery?.toString() || "")) {
      currentPath = newPath;
      currentQuery = newQuery;

      // 라우트 매칭 및 네비게이션 콜백 호출
      const route = matchRoute(newPath);
      onNavigate(route, newQuery);
    }
  }

  /**
   * 경로를 라우트 설정과 매칭하는 함수 (동적 라우팅 지원)
   */
  function matchRoute(path) {
    // 1. 정적 라우트 먼저 체크
    for (const route of routes) {
      if (route.path === path) {
        return { ...route, params: {} };
      }
    }

    // 2. 동적 라우트 체크
    for (const route of routes) {
      const match = matchDynamicRoute(route.path, path);
      if (match) {
        return { ...route, params: match.params };
      }
    }

    // 3. 매칭되지 않으면 404
    return { path: "*", component: "NotFound", params: {} };
  }

  /**
   * 동적 라우트 매칭 헬퍼 함수
   * @param {string} routePath - 라우트 패턴 (예: "/product/:id")
   * @param {string} currentPath - 현재 경로 (예: "/product/123")
   */
  function matchDynamicRoute(routePath, currentPath) {
    // 동적 라우트 패턴이 아니면 null 반환
    if (!routePath.includes(":")) {
      return null;
    }

    const routeParts = routePath.split("/");
    const pathParts = currentPath.split("/");

    // 경로 길이가 다르면 매칭 실패
    if (routeParts.length !== pathParts.length) {
      return null;
    }

    const params = {};

    // 각 부분을 비교하며 파라미터 추출
    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const pathPart = pathParts[i];

      if (routePart.startsWith(":")) {
        // 동적 파라미터 부분
        const paramName = routePart.slice(1); // ':' 제거
        params[paramName] = pathPart;
      } else if (routePart !== pathPart) {
        // 정적 부분이 다르면 매칭 실패
        return null;
      }
    }

    return { params };
  }

  /**
   * 프로그래밍적으로 네비게이션하는 함수
   */
  function navigate(path, query = {}) {
    const queryString = new URLSearchParams(query).toString();
    const appPath = queryString ? `${path}?${queryString}` : path;
    const fullPath = getFullPath(appPath); // BASE_PATH를 포함한 전체 경로 사용

    // URL 변경 (히스토리에 추가)
    window.history.pushState({}, "", fullPath);

    // 수동으로 location change 처리
    handleLocationChange();
  }

  /**
   * 라우터 초기화 함수
   */
  function init() {
    // popstate 이벤트 리스너 등록 (뒤로가기/앞으로가기)
    window.addEventListener("popstate", handleLocationChange);

    // 초기 페이지 로드 시 현재 URL 처리
    handleLocationChange();
  }

  /**
   * 라우터 정리 함수
   */
  function destroy() {
    window.removeEventListener("popstate", handleLocationChange);
  }

  // 라우터 객체 반환
  return {
    init,
    destroy,
    navigate,
    getCurrentPath: () => currentPath,
    getCurrentQuery: () => currentQuery,
  };
}
