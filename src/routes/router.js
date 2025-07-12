const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

const getAppPath = (fullPath = window.location.pathname) => {
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
};

const getFullPath = (appPath) => BASE_PATH + appPath;

import { productDetailPage, detailEvent } from "../pages/productDetailPage";
import { bindEvents } from "../pages/productPage";
import { productPage } from "../pages/productPage";
import { notFoundPage } from "../pages/notFoundPage";
import { cartPage } from "../pages/cartPage";

let currentPath = getAppPath();

const routes = [
  { path: "/", view: productPage },
  { path: "/product/:id", view: productDetailPage },
  { path: "/cart", view: cartPage },
];

export async function render() {
  const path = getAppPath();

  // 현재 경로 업데이트
  currentPath = path;

  if (path.startsWith("/product/")) {
    const id = path.split("/product/")[1];
    await productDetailPage(id);
    detailEvent();
    return;
  }

  const route = routes.find((r) => r.path === path);
  if (route) {
    document.querySelector("#root").innerHTML = route.view();
    bindEvents();
  } else {
    document.querySelector("#root").innerHTML = notFoundPage();
  }
}

// 네비게이션 함수 개선
export function navigateToDetail(productId) {
  const newPath = `/product/${productId}`;

  if (currentPath === newPath) return;

  history.pushState({}, "", getFullPath(newPath));
  render();
}

window.addEventListener("popstate", () => {
  render();
});
