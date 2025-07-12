import { cartPage } from "../pages/cartPage";
import { notFoundPage } from "../pages/notFoundPage";
import { productDetailPage } from "../pages/productDetailPage";
import { productPage } from "../pages/productPage";
const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";
// const getAppPath = (fullPath = window.location.pathname) => {
//   return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
// };

const getFullPath = (appPath) => {
  return BASE_PATH + appPath;
};
export const ROUTES = {
  MAIN: "/",
  PRODUCT: "/product",
  PRODUCT_DETAIL: "/product/detail",
  CART: "/cart",
  ERROR: "/error",
};
const URL_MAP = {
  [ROUTES.MAIN]: productPage,
  [ROUTES.PRODUCT]: productPage,
  [ROUTES.PRODUCT_DETAIL]: productDetailPage,
  [ROUTES.CART]: cartPage,
  [ROUTES.ERROR]: notFoundPage,
};

export async function navigate(pathname, replace = false) {
  history[replace ? "replaceState" : "pushState"](null, "", getFullPath(pathname));
  await render();
}

export async function render() {
  const root = document.querySelector("#root");
  let { pathname } = location;
  pathname = getFullPath(pathname);
  // 경로만 사용하도록 쿼리스트링 제거
  const cleanPath = pathname.split("?")[0];
  const pageFn = URL_MAP[cleanPath] || notFoundPage;
  // 페이지를 그냥 async로 만들어서 사용
  const content = await pageFn();
  root.innerHTML = content;

  if (typeof pageFn.afterRender === "function") {
    pageFn.afterRender();
  }
}

window.addEventListener("popstate", () => {
  render(); // 뒤로/앞으로 이동 시 렌더링
});
