import { Home } from "../pages/Home.js";
import { ProductDetail } from "../pages/ProductDetail.js";

const routes = [
  {
    path: /^\/?$/,
    render: () => Home(),
  },
  {
    path: /^\/product\/(\w+)/,
    render: (match) => ProductDetail(match[1]),
  },
];

export function handleRoute() {
  const path = window.location.pathname;
  for (const route of routes) {
    const match = path.match(route.path);
    if (match) {
      return route.render(match);
    }
  }
  return `<h1>404 Not Found</h1>`;
}

export function navigateTo(url, { replace = false } = {}) {
  if (replace) {
    window.history.replaceState({}, "", url);
  } else {
    window.history.pushState({}, "", url);
  }
  window.dispatchEvent(new PopStateEvent("popstate"));
}
