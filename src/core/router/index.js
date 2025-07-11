let fallback = () => "404 page";
let routesObject = {};
let cleanup = null;

const handleRouteChange = () => {
  const path = window.location.pathname;
  const page = routesObject[path] || fallback;

  if (cleanup) {
    cleanup();
  }

  cleanup = page();
};

/**
 * @description SPA 페이지 이동
 * @param {string} path - pathname 문자열
 * @returns {void}
 */
export const navigate = (path) => {
  history.pushState({}, "", path);
  handleRouteChange();
};

/**
 * @description SPA router 생성
 * @param {Record<string, Function>} routes - ex { '/': MainPage }
 * @param {() => string} fallbackRoute - fallback html 문자열을 반환하는 함수
 * @returns {void}
 */
const createRouter = ({ routes, fallbackRoute }) => {
  if (routes) {
    routesObject = routes;
  }

  if (fallbackRoute) {
    fallback = fallbackRoute;
  }

  window.addEventListener("popstate", handleRouteChange);
  handleRouteChange();
};

export default createRouter;
