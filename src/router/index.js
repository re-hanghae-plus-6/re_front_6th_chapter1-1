import { defaultRoute, routes } from "./routes.js";

export function router() {
  const path = window.location.pathname;
  const routeHandler = routes[path] || defaultRoute;
  routeHandler();
}

export function goTo(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("popstate"));
}
