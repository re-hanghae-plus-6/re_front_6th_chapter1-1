import { Home } from "../pages/Home.js";
import NotFound from "../pages/NotFound.js";
import { ProductDetail } from "../pages/ProductDetail.js";

// BASE PATH 설정
const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

// 유틸 함수
const getAppPath = (fullPath = window.location.pathname) => {
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
};

const getFullPath = (appPath) => {
  return BASE_PATH + appPath;
};

// 라우터 정의
const routes = [
  {
    path: /^\/?$/,
    render: () => Home(),
  },
  {
    path: /^\/product\/(\w+)/,
    render: (match) => ProductDetail(match[1]),
  },
];

// 라우트 처리 함수
export function handleRoute() {
  const appPath = getAppPath();

  for (const route of routes) {
    const match = appPath.match(route.path);
    if (match) {
      return route.render(match);
    }
  }

  // 없는 경로 처리
  document.querySelector("#root").innerHTML = NotFound();
}

// URL 변경 및 라우팅 실행
export function navigateTo(appPath, { replace = false } = {}) {
  const fullPath = getFullPath(appPath);

  if (replace) {
    window.history.replaceState({}, "", fullPath);
  } else {
    window.history.pushState({}, "", fullPath);
  }

  handleRoute();
}

// 뒤로/앞으로 가기 대응
window.onpopstate = handleRoute;
