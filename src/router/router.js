import Home from "../pages/Home.js";
import Detail from "../pages/Detail.js";
import NotFound from "../pages/NotFound.js";
import ExampleLayout from "../pages/ExampleLayout.js"; // 레이아웃 확인용(제출전에 삭제하자)

let currentComponent = null;

export async function router() {
  const $app = document.querySelector("#app");
  if (!$app) return;

  const path = window.location.pathname;
  let component;

  if (path === "/") {
    component = new Home();
  } else if (path.startsWith("/product/")) {
    const productId = path.split("/")[2];
    // 매번 새로운 Detail 인스턴스 생성
    component = new Detail({ productId });
  } else if (path === "/ex") {
    component = new ExampleLayout();
  } else {
    component = new NotFound();
  }

  // 이전 컴포넌트 destroy 호출
  if (currentComponent && typeof currentComponent.destroy === "function") {
    currentComponent.destroy();
  }

  if (component.init) {
    await component.init();
  }

  $app.innerHTML = "";
  $app.appendChild(component.render());

  // 현재 컴포넌트 추적
  currentComponent = component;
}
