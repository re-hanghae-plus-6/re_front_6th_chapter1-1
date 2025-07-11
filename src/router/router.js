import Home from "../pages/Home.js";
import Detail from "../pages/Detail.js";
import NotFound from "../pages/NotFound.js";

// 환경에 따라 BASE_PATH 자동 설정
export const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

// 전체 경로에서 앱 경로만 추출
const getAppPath = (fullPath = window.location.pathname) => {
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
};

// 앱 경로를 전체 경로로 변환
const getFullPath = (appPath) => {
  return BASE_PATH + appPath;
};

let currentComponent = null;

export async function router() {
  const $app = document.querySelector("#app");
  if (!$app) return;

  const path = getAppPath();
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

// popstate 이벤트 리스너
export function initRouter() {
  window.addEventListener("popstate", router);
  router(); // 최초 실행
}

// 페이지 이동 시 사용할 함수
export function navigate(appPath) {
  const fullPath = getFullPath(appPath);
  window.history.pushState({}, "", fullPath);
  window.dispatchEvent(new CustomEvent("urlchange"));
  router();
}
