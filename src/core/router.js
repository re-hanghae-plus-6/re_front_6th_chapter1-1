/* --------------------------------------------------------------------------
 * Nested Router (React-Router inspired) – Vanilla JS SPA Router
 * 기존 API(createRouter, setupRouter 등)는 유지하면서 중첩 라우트·동적 세그먼트·loader
 * 를 지원하도록 전체 구현을 교체합니다.
 * -------------------------------------------------------------------------- */

import createObserver from "./observer.js";

// BASE_PATH 는 Vite 미리보기/배포 경로에 맞게 설정
const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

/* --------------------------------------------------------------------------
 * Public URL helpers (기존 파일과 동일 시그니처 유지)
 * -------------------------------------------------------------------------- */
export const getAppPath = (fullPath = window.location.pathname) => {
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
};

export const getFullPath = (appPath) => {
  return BASE_PATH + appPath;
};

/* --------------------------------------------------------------------------
 * Path utilities for nested matching
 * -------------------------------------------------------------------------- */
function splitPath(path) {
  return path.replace(/^\/+/g, "").replace(/\/+$/g, "").split("/").filter(Boolean);
}

function isDynamic(segment) {
  return segment && segment[0] === ":";
}

/**
 * 재귀적으로 중첩 라우트를 탐색하여 가장 먼저 매칭되는 leaf 라우트를 반환.
 * @returns {{ node: Object, params: Object }|null}
 */
function matchRouteRecursive(pathSegments, routes, params = {}) {
  for (const route of routes) {
    const routeSegments = splitPath(route.path);
    if (routeSegments.length > pathSegments.length) continue;

    let matched = true;
    const paramMap = { ...params };

    for (let i = 0; i < routeSegments.length; i++) {
      const seg = routeSegments[i];
      if (isDynamic(seg)) {
        const paramName = seg.slice(1);
        paramMap[paramName] = pathSegments[i];
      } else if (seg !== pathSegments[i]) {
        matched = false;
        break;
      }
    }

    if (!matched) continue;

    const rest = pathSegments.slice(routeSegments.length);

    // leaf
    if (rest.length === 0) {
      return { node: route, params: paramMap };
    }

    // child 탐색
    if (route.children && route.children.length > 0) {
      const child = matchRouteRecursive(rest, route.children, paramMap);
      if (child) return child;
    }
  }
  return null;
}

/* --------------------------------------------------------------------------
 * Router factory (nested-route capable, 기존 API 유지)
 * -------------------------------------------------------------------------- */
function createRouterInstance() {
  const routes = [];
  // Observer를 이용해 라우트 변경을 publish
  const { subscribe: obsSubscribe, notify: obsNotify } = createObserver();
  let currentRoute = null;
  let isDestroyed = false;

  /* -------------------------------- add routes --------------------------- */
  const addRoute = (path, component, loader = null, children = null) => {
    routes.push({ path, component, loader, children });
  };

  const addRoutes = (arr) => {
    if (!Array.isArray(arr)) return;

    const normalize = (r) => {
      const { path, component, loader = null, children = null } = r;
      return { path, component: component || r.view, loader, children };
    };

    arr.forEach((r) => {
      if (!r || !r.path) return;
      const node = normalize(r);
      addRoute(node.path, node.component, node.loader, node.children);
    });
  };

  /* ---------------------------- route matching --------------------------- */
  const matchCurrent = (pathname) => {
    const segments = splitPath(getAppPath(pathname));
    const result = matchRouteRecursive(segments, routes);
    return result;
  };

  /* -------------------------- notify subscribers ------------------------- */
  const notifyRouteChange = () => {
    // Observer 기반 알림
    obsNotify(currentRoute);
  };

  /* -------------------------- render pipeline ---------------------------- */
  const handleRouteChange = async () => {
    if (isDestroyed) return;

    const pathname = window.location.pathname;
    const matched = matchCurrent(pathname);

    if (matched) {
      const { node, params } = matched;
      let data = null;
      if (typeof node.loader === "function") {
        try {
          data = await node.loader(params);
        } catch (err) {
          console.error("[Router] loader error", err);
          return navigate("/404", { replace: true });
        }
      }
      currentRoute = {
        route: node,
        params,
        pathname: getAppPath(pathname),
        data,
      };
    } else {
      // 404 fallback (동적 경로 포함 실패 시)
      const notFound = routes.find((r) => r.path === "/404") || { path: "/404", component: null };
      currentRoute = {
        route: notFound,
        params: {},
        pathname: getAppPath(pathname),
        data: null,
      };
    }

    notifyRouteChange();
  };

  /* --------------------------- history helpers --------------------------- */
  const navigate = (path, { replace = false } = {}) => {
    if (isDestroyed) {
      console.warn("Router is destroyed. Cannot navigate.");
      return;
    }

    const fullPath = getFullPath(path);
    if (replace) {
      window.history.replaceState({}, "", fullPath);
    } else {
      window.history.pushState({}, "", fullPath);
    }
    handleRouteChange();
  };

  /* ------------------------------ lifecycle ------------------------------ */
  const onPopState = () => {
    if (!isDestroyed) handleRouteChange();
  };

  window.addEventListener("popstate", onPopState);

  const subscribe = (listener) => {
    if (isDestroyed) return () => {};
    return obsSubscribe(listener);
  };

  const init = () => handleRouteChange();

  const destroy = () => {
    isDestroyed = true;
    routerApi._isDestroyed = true;
    window.removeEventListener("popstate", onPopState);
    // Observer 내부 listener 는 가비지 컬렉션 대상으로 두기 때문에 별도 clear 필요 없음
    routes.length = 0;
    currentRoute = null;
  };

  /* ---------------------------- public object ---------------------------- */
  const routerApi = {
    addRoute,
    addRoutes,
    navigate,
    subscribe,
    init,
    destroy,
    routes, // 외부 helper(useParams 등)에서 경로 정의 접근 가능
    _isDestroyed: false,
  };

  return routerApi;
}

/* --------------------------------------------------------------------------
 * createRouter (exported)
 * -------------------------------------------------------------------------- */
export function createRouter(initialRoutes = []) {
  const router = createRouterInstance();
  if (initialRoutes.length > 0) {
    router.addRoutes(initialRoutes);
  }
  return router;
}

/* --------------------------------------------------------------------------
 * Global router helpers (setup/get/cleanup)
 * -------------------------------------------------------------------------- */
let globalRouter = null;

export function setupRouter(router) {
  if (globalRouter) globalRouter.destroy();
  globalRouter = router;

  if (!window.navigateTo) {
    window.navigateTo = (path, options) => {
      if (globalRouter && !globalRouter._isDestroyed) {
        globalRouter.navigate(path, options);
      }
    };
  }

  if (process.env.NODE_ENV !== "production") {
    window.router = router;
  }
}

export function getRouter() {
  return globalRouter;
}

export function cleanupRouter() {
  if (globalRouter) {
    globalRouter.destroy();
    globalRouter = null;
  }
  if (window.navigateTo) delete window.navigateTo;
  if (window.router) delete window.router;
}

/* --------------------------------------------------------------------------
 * Query-string helpers (기존 시그니처 유지)
 * -------------------------------------------------------------------------- */
export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params.entries()) {
    result[key] = decodeURIComponent(value);
  }
  return result;
};

export const updateQueryParams = (params, { replace = false } = {}) => {
  const current = new URLSearchParams();
  Object.entries(params).forEach(([key, v]) => {
    if (v !== "" && v !== null && v !== undefined) {
      current.set(key, v);
    }
  });
  const newUrl = `${window.location.pathname}${current.toString() ? `?${current.toString()}` : ""}`;
  if (replace) window.history.replaceState({}, "", newUrl);
  else window.history.pushState({}, "", newUrl);
};

export function navigate(path, options = {}) {
  const r = getRouter();
  if (r && !r._isDestroyed) {
    r.navigate(path, options);
  }
}
