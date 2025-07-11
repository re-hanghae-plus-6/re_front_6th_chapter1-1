import ListPage from "./pages/list.js";
import DetailPage from "./pages/detail.js";
import NotFoundPage from "./pages/404.js";

export function getPageComponentByPath(path) {
  if (path === "/") return ListPage;
  if (path.startsWith("/detail")) return DetailPage;
  return NotFoundPage;
}

export function renderRoute() {
  const PageComponent = getPageComponentByPath(window.location.pathname);
  document.getElementById("root").innerHTML = PageComponent();
  if (PageComponent.mount) PageComponent.mount();
}
