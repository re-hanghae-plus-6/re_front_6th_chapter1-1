import { Home } from "../pages/Home.js";
import NotFound from "../pages/NotFound.js";
import { ProductDetail } from "../pages/ProductDetail.js";

// BASE PATH 설정 (배포 환경 대비)
const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

//  유틸 함수: BASE_PATH와 관련된 경로 계산
const getAppPath = (fullPath = window.location.pathname) => {
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
};

const getFullPath = (appPath) => {
  return BASE_PATH + appPath;
};

//  라우트 정의
const routes = [
  {
    path: /^\/?$/, // 홈
    render: () => Home(),
  },
  {
    path: /^\/product\/(\w+)/, // 상품 상세
    render: (match) => ProductDetail(match[1]),
  },
];

//  현재 경로 기반 렌더링
export function handleRoute() {
  const appPath = getAppPath();

  for (const route of routes) {
    const match = appPath.match(route.path);
    if (match) {
      return route.render(match);
    }
  }

  // 매칭되는 라우트 없을 경우 404 처리
  document.querySelector("#root").innerHTML = NotFound();
}

//  SPA 내에서 URL 변경 후 라우트 실행
export function navigateTo(appPath, { replace = false } = {}) {
  const fullPath = getFullPath(appPath);

  if (replace) {
    window.history.replaceState({}, "", fullPath);
  } else {
    window.history.pushState({}, "", fullPath);
  }

  handleRoute();
}

//  브라우저 뒤로가기/앞으로가기 시 라우트 재실행
window.onpopstate = handleRoute;
