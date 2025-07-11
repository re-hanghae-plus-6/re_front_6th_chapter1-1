import Home from "../pages/Home.js";
import Detail from "../pages/Detail.js";
import NotFound from "../pages/NotFound.js";
import ExampleLayout from "../pages/ExampleLayout.js";

let currentComponent = null;
let isRouting = false; // 라우팅 중복 실행 방지

export async function router() {
  console.log("🔄 router 실행 - 경로:", window.location.pathname);

  // 이미 라우팅 중이면 중단
  if (isRouting) {
    console.log("⚠️ 이미 라우팅 중 - 중단");
    return;
  }

  isRouting = true;

  const $app = document.querySelector("#app");
  if (!$app) {
    console.error("❌ #app을 찾을 수 없음");
    isRouting = false;
    return;
  }

  const path = window.location.pathname;
  let component;

  if (path === "/") {
    console.log("🏠 Home 컴포넌트 생성");
    component = new Home();
  } else if (path.startsWith("/product/")) {
    const productId = path.split("/")[2];
    console.log("📦 Detail 컴포넌트 생성 - productId:", productId);
    component = new Detail({ productId });
  } else if (path === "/ex") {
    component = new ExampleLayout();
  } else {
    component = new NotFound();
  }

  // 이전 컴포넌트 destroy 호출
  if (currentComponent && typeof currentComponent.destroy === "function") {
    console.log("🗑️ 이전 컴포넌트 destroy");
    currentComponent.destroy();
  }

  if (component.init) {
    console.log("🚀 컴포넌트 init 실행");
    await component.init();
  }

  console.log(" DOM 업데이트");
  $app.innerHTML = "";
  $app.appendChild(component.render());

  // 현재 컴포넌트 추적
  currentComponent = component;
  console.log("✅ router 완료");

  // 라우팅 완료 후 플래그 해제
  setTimeout(() => {
    isRouting = false;
  }, 0);
}

// 테스트용 초기화 함수
export function resetRouter() {
  if (currentComponent && typeof currentComponent.destroy === "function") {
    currentComponent.destroy();
  }
  currentComponent = null;
  isRouting = false;
}
