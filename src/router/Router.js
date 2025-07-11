import { PageNotFound } from "../pages/_404_.js";
import { MainPage } from "../pages/MainPage.js";
import { ProductPage } from "../pages/ProductPage.js";

export async function Router() {
  const path = window.location.pathname;
  const detailMatch = path.match(/^\/product\/(.+)$/);
  if (path === "/" || path === "") {
    return await MainPage();
  }
  if (detailMatch) {
    // TODO: 상품상세페이지 만들면 꼭 교체하기!
    return await ProductPage();
  }

  return PageNotFound();
}
