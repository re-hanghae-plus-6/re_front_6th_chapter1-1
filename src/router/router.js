import Home from "../pages/Home.js";
import Detail from "../pages/Detail.js";
import NotFound from "../pages/NotFound.js";
import ExampleLayout from "../pages/ExampleLayout.js";

let currentComponent = null;
let isRouting = false; // 중복 실행 방지

export async function router() {
  // 이미 라우팅 중이면 중단
  if (isRouting) {
    return;
  }

  isRouting = true;

  const $app = document.querySelector("#app");
  if (!$app) {
    isRouting = false;
    return;
  }

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

  // 이전 컴포넌트 정리
  if (currentComponent && typeof currentComponent.destroy === "function") {
    currentComponent.destroy();
  }

  if (component.init) {
    await component.init();
  }

  $app.innerHTML = "";
  $app.appendChild(component.render());

  currentComponent = component;

  // 플래그 해제
  setTimeout(() => {
    isRouting = false;
  }, 0);
}

export function resetRouter() {
  if (currentComponent && typeof currentComponent.destroy === "function") {
    currentComponent.destroy();
  }
  currentComponent = null;
  isRouting = false;
}
