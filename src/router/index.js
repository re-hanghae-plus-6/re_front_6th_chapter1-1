import { routes } from "./routes.js";

export function router() {
  const path = window.location.pathname;
  for (const route of routes) {
    const match = path.match(route.path);
    if (match) {
      route.action(match);
      return;
    }
  }
}
