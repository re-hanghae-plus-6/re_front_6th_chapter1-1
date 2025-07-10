// URL 변화를 감지하고 라우팅을 처리하는 함수형 라우터

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
    const newPath = window.location.pathname;
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
   * 경로를 라우트 설정과 매칭하는 함수 (임시 구현)
   */
  function matchRoute(path) {
    // 일단 기본적인 매칭만 구현
    for (const route of routes) {
      if (route.path === path) {
        return route;
      }
    }

    // 매칭되지 않으면 404
    return { path: "*", component: "NotFound" };
  }

  /**
   * 프로그래밍적으로 네비게이션하는 함수
   */
  function navigate(path, query = {}) {
    const queryString = new URLSearchParams(query).toString();
    const fullPath = queryString ? `${path}?${queryString}` : path;

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
