import { cartPage } from "../pages/cartPage";
import { notFoundPage } from "../pages/notFoundPage";
import { productDetailPage } from "../pages/productDetailPage";
import { productPage } from "../pages/productPage";
const ROUTES = {
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

export function navigate(pathname, replace = false) {
  history[replace ? "replaceState" : "pushState"](null, "", pathname);
  render(); // 라우팅 후 화면 다시 그리기
}

export function render() {
  const root = document.querySelector("#root");
  console.log(root);
  let { pathname } = location;
  if ((pathname === ROUTES.MAIN || pathname === ROUTES.PRODUCT) && pathname !== ROUTES.PRODUCT) {
    return navigate(ROUTES.PRODUCT, true); // replace = true
  }

  const page = URL_MAP[pathname] || notFoundPage;
  root.innerHTML = page();
}

window.addEventListener("popstate", () => {
  render(); // 뒤로/앞으로 이동 시 렌더링
});
