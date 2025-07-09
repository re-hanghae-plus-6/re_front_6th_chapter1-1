import Home from "./pages/Home.js";
import Detail from "./pages/Detail.js";
import NotFound from "./pages/NotFound.js";

const routes = {
  "/": Home,
  "/product/:productId": Detail,
  "*": NotFound,
};

export function router() {
  const path = window.location.pathname;

  let route = routes[path];
  let params = {};

  if (!route) {
    const productMatch = path.match(/^\/product\/(.+)$/);
    if (productMatch) {
      route = routes["/product/:productId"];
      params = { productId: productMatch[1] };
    } else {
      route = routes["*"];
    }
  }

  const component = route(params);
  const root = document.getElementById("root");

  if (!root) return;

  if (component && component.template && component.mount) {
    root.innerHTML = component.template;
    component.mount();
  } else {
    root.innerHTML = component;
  }
}
