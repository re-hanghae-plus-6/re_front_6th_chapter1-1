import { _404_ } from "./pages/404.js";
import { HomePage } from "./pages/HomePage";
import { ProductDetailPage } from "./pages/ProductDetailPage.js";

const routes = defineRoutes([
  { path: "/", component: () => HomePage() },
  { path: "/products/detail/:id", component: (id) => ProductDetailPage(id) },
]);

export function navigate(url) {
  history.pushState(null, "", url);
  document.getElementById("root").innerHTML = renderRoute(url);
}

export function defineRoutes(routeList) {
  return routeList.map(({ path, component }) => {
    const { regex, paramNames } = pathToRegex(path);
    return { path, regex, paramNames, component };
  });
}

function pathToRegex(path) {
  const paramNames = [];
  const regexPath = path.replace(/:([^/]+)/g, (_, key) => {
    paramNames.push(key);
    return "([^/]+)";
  });

  const regex = new RegExp(`^${regexPath}$`);
  return { regex, paramNames };
}

export function renderRoute(pathname) {
  for (const route of routes) {
    const match = pathname.match(route.regex);
    if (match) {
      const params = {};
      route.paramNames.forEach((key, index) => {
        params[key] = match[index + 1];
      });
      return route.component(...Object.values(params));
    }
  }
  return _404_();
}

window.addEventListener("popstate", () => {
  const currentUrl = window.location.pathname;
  document.getElementById("root").innerHTML = renderRoute(currentUrl, routes);
});

document.addEventListener("click", (e) => {
  const target = e.target.closest("a[data-link]");
  if (target) {
    e.preventDefault();
    const url = target.getAttribute("href");
    navigate(url);
  }
});
