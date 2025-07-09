import { render } from "./render.js";
import { store } from "./store.js";

export function createRouter() {
  const router = {
    routes: {},
    handlePopState: () => {
      router.handleRoute(window.location.pathname);
    },
    addRoute: (path, route) => {
      router.routes[path] = route;
    },
    push: (path) => {
      window.history.pushState(null, "", path);
      store.setState("mounted", false);
      render();
    },
  };

  window.addEventListener("popstate", () => {
    store.setState("mounted", false);
    render();
  });

  return router;
}

export const router = new createRouter();
