import { createObserver } from "./utils/createObserver.js";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => window.location.pathname;

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
    window.history.pushState(null, null, path);
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
  const currentPath = window.location.pathname;
  const routerInstance = router.get();

  if (!routerInstance || !routerInstance.routes) return {};

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
    pathname: window.location.pathname,
    state: window.history.state,
  };
};
