import { PageNotFound } from "../pages/_404_.js";
import { MainPage } from "../pages/MainPage.js";
import { ProductPage } from "../pages/ProductPage.js";

const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

export const getAppPath = (fullPath = window.location.pathname) => {
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
};

export const getFullPath = (appPath) => {
  return BASE_PATH + appPath;
};

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
