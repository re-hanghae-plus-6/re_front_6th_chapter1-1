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
  console.log(pathname);
  history[replace ? "replaceState" : "pushState"](null, "", pathname);
  render(); // 라우팅 후 화면 다시 그리기
}

export function render() {
  const root = document.querySelector("#root");
  console.log(root);
  let { pathname } = location;
  // if (pathname === ROUTES.MAIN) {
  //   // navigate(ROUTES.PRODUCT);
  // } else if (pathname === ROUTES.PRODUCT) {
  //   // navigate(ROUTES.PRODUCT, true);
  // }

  const page = URL_MAP[pathname] || notFoundPage;
  console.log("page:", page);
  root.innerHTML = page();
}

function getPathWithParams() {
  const pathname = location.pathname;
  const params = new URLSearchParams(location.search);
  return { pathname, params };
}

function setEventListener() {
  const root = document.querySelector("#root");
  root.addEventListener("input", (e) => {
    if (e.target && e.target.id === "limit-select") {
      const { params, pathname } = getPathWithParams();
      if (e.target.value) {
        params.set("limit", e.target.value);
      } else {
        params.delete("limit");
      }
      navigate(`${pathname}?${params.toString()}`);
    }
  });
}

setEventListener();

window.addEventListener("popstate", () => {
  render(); // 뒤로/앞으로 이동 시 렌더링
});
