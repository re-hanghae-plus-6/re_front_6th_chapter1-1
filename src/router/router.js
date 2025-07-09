import Home from "../pages/Home.js";
import Detail from "../pages/Detail.js";
import NotFound from "../pages/NotFound.js";
import ExampleLayout from "../pages/ExampleLayout.js"; // 레이아웃 확인용(제출전에 삭제하자)

const routes = {
  "/": Home,
  "/detail": Detail,
  "/ex": ExampleLayout,
};

export function router() {
  const $app = document.querySelector("#app");
  if (!$app) return;

  const path = location.hash.replace("#", "") || "/";
  const Route = routes[path] || NotFound;

  // Route가 생성자 함수(클래스)인지 확인하여 인스턴스화
  const isClass = typeof Route === "function" && /^[A-Z]/.test(Route.name);
  const Component = isClass ? new Route() : Route;

  $app.innerHTML = "";
  $app.appendChild(Component.render());

  if (Component.init) {
    Component.init();
  }
}
