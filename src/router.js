import { createObserver } from "./utils/createObserver.js";

const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

const getAppPath = (fullPath = window.location.pathname) => {
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
};

const getFullPath = (appPath) => {
  return BASE_PATH + appPath;
};

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => getAppPath();

  const getTarget = () => {
    const currentPath = getPath();

    if (routes[currentPath]) {
      return routes[currentPath];
    }

    for (const [routePath, component] of Object.entries(routes)) {
      if (routePath.includes(":")) {
        const pathParts = routePath.split("/");
        const currentParts = currentPath.split("/");

        if (pathParts.length === currentParts.length) {
          const match = pathParts.every((part, index) => part.startsWith(":") || part === currentParts[index]);
          if (match) {
            return component;
          }
        }
      }
    }

    return null;
  };

  const push = (path) => {
    window.history.pushState(null, null, getFullPath(path));
    notify();
  };

  window.addEventListener("popstate", () => notify());

  return {
    get path() {
      return getPath();
    },
    push,
    subscribe,
    getTarget,
    routes,
  };
};

export const router = {
  value: null,
  get() {
    return this.value;
  },
  set(newValue) {
    this.value = newValue;
  },
};

export const navigate = (path) => {
  router.get().push(path);
};

export const useParams = () => {
  const routerInstance = router.get();
  if (!routerInstance || !routerInstance.routes) return {};

  const currentPath = getAppPath();

  for (const [routePath] of Object.entries(routerInstance.routes)) {
    if (routePath.includes(":")) {
      const pathParts = routePath.split("/");
      const currentParts = currentPath.split("/");

      if (pathParts.length === currentParts.length) {
        const match = pathParts.every((part, index) => part.startsWith(":") || part === currentParts[index]);

        if (match) {
          const params = {};
          pathParts.forEach((part, index) => {
            if (part.startsWith(":")) {
              const key = part.slice(1);
              params[key] = currentParts[index];
            }
          });
          return params;
        }
      }
    }
  }

  return {};
};

export const useLocation = () => {
  return {
    pathname: getAppPath(),
    state: window.history.state,
  };
};
