import Home from "../pages/Home.js";
import Detail from "../pages/Detail.js";
import NotFound from "../pages/NotFound.js";

let currentComponent = null;

// 해시 라우팅 경로 추출
function getHashPath() {
  // #/product/1 → /product/1
  return window.location.hash.replace(/^#/, "") || "/";
}

export async function router() {
  const $app = document.querySelector("#app");
  if (!$app) return;

  const path = getHashPath();
  let component = null;

  // 홈
  if (path === "/") {
    component = new Home();
  }
  // 상품 상세
  else if (/^\/product\/[\w-]+$/.test(path)) {
    const productId = path.split("/")[2];
    if (productId) {
      component = new Detail({ productId });
    } else {
      component = new NotFound();
    }
  }
  // 그 외는 모두 404
  else {
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

  currentComponent = component;
}

// 해시 변경 이벤트 리스너
export function initRouter() {
  window.addEventListener("hashchange", router);
  router(); // 최초 실행
}
