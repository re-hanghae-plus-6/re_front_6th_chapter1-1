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

  const path = window.location.pathname;
  let component;

  if (path === "/") {
    component = new Home();
  } else if (path.startsWith("/product/")) {
    const productId = path.split("/")[2];
    component = new Detail({ productId });
  } else if (path === "/ex") {
    component = new ExampleLayout();
  } else {
    component = new NotFound();
  }

  if (component.init) {
    await component.init();
  }

  $app.innerHTML = "";
  $app.appendChild(component.render());
}

window.addEventListener("popstate", router);
