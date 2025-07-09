import { routes } from "./routes.js";

// 어떻게 짜여졌고 동작하는지 여부는 파악이 필요

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
