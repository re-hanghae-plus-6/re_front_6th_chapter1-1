import Home from "./pages/Home.js";
import Detail from "./pages/Detail.js";
import NotFound from "./pages/NotFound.js";

const routes = {
  "/": Home,
  "/detail": Detail,
};

export function router() {
  const path = location.hash.replace("#", "") || "/";
  const view = routes[path] || NotFound;

  document.getElementById("app").innerHTML = view.render();
  if (view.afterRender) view.afterRender();
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);
