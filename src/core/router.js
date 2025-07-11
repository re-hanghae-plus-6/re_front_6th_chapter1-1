const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

export const getAppPath = (fullPath = window.location.pathname) => {
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
};

export const getFullPath = (appPath) => {
  return BASE_PATH + appPath;
};

function pathToRegex(path) {
  const regexPath = path
    .replace(/:\w+/g, "([^/]+)") // :id -> ([^/]+)
    .replace(/\//g, "\\/") // / -> \/
    .replace(/\*/g, ".*"); // * -> .*

  return new RegExp(`^${regexPath}$`);
}

// ":param" 이름 추출 → ["param", ...]
function extractParamNames(path) {
  const matches = path.match(/:(\w+)/g);
  return matches ? matches.map((m) => m.slice(1)) : [];
}

function createRouterInstance() {
  const routes = [];
  const listeners = new Set();
  let currentRoute = null;
  let isDestroyed = false;

  const matchRoute = (pathname) => {
    for (const route of routes) {
      const match = pathname.match(route.regex);
      if (match) {
        // URL 파라미터 매핑
        const params = {};
        route.paramNames.forEach((name, idx) => {
          params[name] = match[idx + 1];
        });
        return { route, params, pathname };
      }
    }
    return null;
  };

  const notifyListeners = () => {
    listeners.forEach((listener) => {
      try {
        listener(currentRoute);
      } catch (err) {
        console.error("Router listener error:", err);
      }
    });
  };

  const handleRouteChange = async () => {
    if (isDestroyed) return;

    const pathname = getAppPath();
    const matched = matchRoute(pathname);

    if (matched) {
      let data = null;
      if (matched.route.loader) {
        try {
          data = await matched.route.loader(matched.params);
        } catch (err) {
          console.error("Route loader error:", err);
          navigate("/404", { replace: true });
          return;
        }
      }
      currentRoute = { ...matched, data };
    } else {
      // 404 대응
      currentRoute = {
        route: routes.find((r) => r.path === "/404") || { path: "/404", component: null },
        params: {},
        pathname,
        data: null,
      };
    }

    notifyListeners();
  };

  const onPopState = () => {
    if (!isDestroyed) handleRouteChange();
  };

  window.addEventListener("popstate", onPopState);

  const addRoute = (path, component, loader = null) => {
    if (isDestroyed) {
      console.warn("Router is destroyed. Cannot add route.");
      return;
    }

    routes.push({
      path,
      component,
      loader,
      regex: pathToRegex(path),
      paramNames: extractParamNames(path),
    });
  };

  const addRoutes = (arr) => {
    if (!Array.isArray(arr)) return;
    arr.forEach((r) => {
      if (!r || !r.path) return;
      addRoute(r.path, r.component || r.view, r.loader || null);
    });
  };

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

  const subscribe = (listener) => {
    if (isDestroyed) {
      console.warn("Router is destroyed. Cannot subscribe.");
      return () => {};
    }

    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const init = async () => {
    if (isDestroyed) {
      console.warn("Router is destroyed. Cannot initialize.");
      return;
    }
    await handleRouteChange();
  };

  const destroy = () => {
    isDestroyed = true;
    routerApi._isDestroyed = true; // 외부 확인용 플래그 동기화
    window.removeEventListener("popstate", onPopState);
    listeners.clear();
    routes.length = 0;
    currentRoute = null;
  };

  // 외부에 노출되는 객체
  const routerApi = {
    addRoute,
    addRoutes,
    navigate,
    subscribe,
    init,
    destroy,
    _isDestroyed: false,
  };

  return routerApi;
}

export function createRouter() {
  return createRouterInstance();
}

let globalRouter = null;

export function setupRouter(router) {
  // 기존 라우터 정리
  if (globalRouter) globalRouter.destroy();
  globalRouter = router;

  // window.navigateTo 헬퍼 등록
  if (!window.navigateTo) {
    window.navigateTo = (path, options) => {
      if (globalRouter && !globalRouter._isDestroyed) {
        globalRouter.navigate(path, options);
      }
    };
  }

  // 개발 편의 디버깅 노출
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
