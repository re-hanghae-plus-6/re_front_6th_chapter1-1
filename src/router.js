import { BASE_PATH } from "./constants.js";
import { render } from "./render.js";
import { store } from "./store.js";

export function createRouter() {
  const router = {
    routes: {},
    addRoute: (path, route) => {
      router.routes[path] = route;
    },
    push: (path) => {
      window.history.pushState(null, "", `${BASE_PATH}${path}`);
      store.setState("mounted", false);
      window.scrollTo(0, 0);
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
