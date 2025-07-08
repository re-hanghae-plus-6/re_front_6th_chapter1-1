import ListPage from "./pages/list.js";
import DetailPage from "./pages/detail.js";

export function getPageComponentByPath(path) {
  if (path === "/") return ListPage;
  if (path === "/detail") return DetailPage;
  return () => "<div>페이지를 찾을 수 없습니다</div>";
}

export function renderRoute() {
  const PageComponent = getPageComponentByPath(window.location.pathname);
  document.getElementById("root").innerHTML = PageComponent();
  if (PageComponent.mount) PageComponent.mount();
}
