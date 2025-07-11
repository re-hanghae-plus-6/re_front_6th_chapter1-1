import { Home } from "../pages/Home.js";
import NotFound from "../pages/NotFound.js";
import { ProductDetail } from "../pages/ProductDetail.js";

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
  const path = window.location.pathname;

  for (const route of routes) {
    const match = path.match(route.path);
    if (match) {
      return route.render(match);
    }
  }

  // 없는 경로일 경우 404 처리
  document.querySelector("#root").innerHTML = NotFound();
}

// URL 변경 및 라우팅 실행
export function navigateTo(url, { replace = false } = {}) {
  if (replace) {
    window.history.replaceState({}, "", url);
  } else {
    window.history.pushState({}, "", url);
  }

  handleRoute(); // ✅ URL 바꾼 후 렌더링 실행
}

// 뒤로가기/앞으로가기 시에도 라우트 다시 실행
window.onpopstate = handleRoute;
