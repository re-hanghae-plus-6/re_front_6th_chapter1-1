import { _404_ } from "./pages/404.js";
import { HomePage } from "./pages/HomePage";
import { ProductDetailPage } from "./pages/ProductDetailPage.js";

let currentComponent = null;
const routes = defineRoutes([
  { path: "/", component: () => HomePage },
  { path: "/products/:id", component: (id) => ProductDetailPage(id) },
]);

export function navigate(url) {
  history.pushState(null, "", url);
  renderRoute(url);
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
  if (currentComponent?.unmount) {
    currentComponent.unmount(); // 이전 페이지 언마운트
  }

  for (const route of routes) {
    const match = pathname.match(route.regex);
    if (match) {
      const params = {};
      route.paramNames.forEach((key, index) => {
        params[key] = match[index + 1];
      });

      const component = route.component(...Object.values(params)); // ex. HomePage
      currentComponent = component;

      const root = document.getElementById("root");
      component.mount(root); // mount 내부에서 render 실행됨
      return;
    }
  }

  // 404 fallback
  const root = document.getElementById("root");
  root.innerHTML = _404_();
  currentComponent = null;
}

window.addEventListener("popstate", () => {
  const currentUrl = window.location.pathname;
  renderRoute(currentUrl);
});

document.addEventListener("click", (e) => {
  const target = e.target.closest("a[data-link]");
  if (target) {
    e.preventDefault();
    const url = target.getAttribute("href");
    navigate(url);
  }
});
