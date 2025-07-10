import Home from "../pages/Home.js";
import Detail from "../pages/Detail.js";
import NotFound from "../pages/NotFound.js";
import ExampleLayout from "../pages/ExampleLayout.js"; // 레이아웃 확인용(제출전에 삭제하자)

// const routes = {
//   "/": Home,
//   "/detail": Detail,
//   "/ex": ExampleLayout,
// };

export async function router() {
  const $app = document.querySelector("#app");
  if (!$app) return;

  let hashPath = location.hash.replace("#", "");
  if (hashPath.startsWith("/")) {
    hashPath = hashPath.substring(1);
  }
  const pathParts = hashPath.split("/");
  let path = "/";
  let params = {};

  if (pathParts.length > 1 && pathParts[0] === "product") {
    path = "/product/:id";
    params.id = pathParts[1];
  } else {
    path = `/${pathParts[0]}`;
  }

  const routesWithParams = {
    "/": Home,
    "/product/:id": Detail,
    "/ex": ExampleLayout,
  };

  const Route = routesWithParams[path] || NotFound;

  const isClass = typeof Route === "function" && /^[A-Z]/.test(Route.name);
  const component = isClass ? new Route() : Route;

  if (component.init) {
    await component.init();
  }

  $app.innerHTML = "";
  $app.appendChild(component.render());
}
