// router.js
import Home from "../pages/Home.js";
import Detail from "../pages/Detail.js";
import NotFound from "../pages/NotFound.js";

const routes = {
  "/": Home,
  "/detail": Detail,
};

export function router() {
  const $app = document.querySelector("#app");
  if (!$app) return;

  const path = location.hash.replace("#", "") || "/";
  const Component = routes[path] || NotFound;

  // 1. 컴포넌트의 render()를 호출하여 DOM 요소를 얻고 화면에 추가합니다.
  $app.innerHTML = "";
  $app.appendChild(Component.render());

  // 2. 화면에 추가된 후, init()가 있다면 호출하여 데이터 로딩 등을 시작합니다.
  if (Component.init) {
    Component.init();
  }
}
