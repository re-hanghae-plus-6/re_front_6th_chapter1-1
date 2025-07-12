// import { getProduct } from "../../api/productApi.js";
// import { HomePage } from "../HomePage.js";
// import { ProductDetailPage } from "../ProductDetailPage.js";
// import { attachEvents } from "../../main.js";
// import { getRelatedProducts } from "../../main.js";
// import { ErrorPage } from "../ErrorPage.js";

// export async function PageRouter() {
//   const root = document.getElementById("root");
//   const path = window.location.pathname;

//   const productDetailMatch = path.match(/^\/product\/(\d+)/);
//   if (productDetailMatch) {
//     const productId = productDetailMatch[1];
//     const product = await getProduct(productId);
//     const relatedProducts = await getRelatedProducts(product);
//     console.log("relatedProducts", relatedProducts);
//     root.innerHTML = ProductDetailPage({ product, relatedProducts });
//     attachEvents(); // ProductDetailPage 렌더 후에만 attachEvents 호출
//     return;
//   }

//   const errorMatch = path.match(/^\/non-existent-page/);
//   if (errorMatch) {
//     root.innerHTML = ErrorPage();
//     return;
//   }

//   // 기본(홈) 페이지
//   root.innerHTML = HomePage({
//     // ...state,
//     // selectedCategory,
//   });

//   // //attachEvents();
// }

import { getProduct } from "../../api/productApi.js";
import { HomePage } from "../HomePage.js";
import { ProductDetailPage } from "../ProductDetailPage.js";
import { attachEvents } from "../../main.js";
import { getRelatedProducts } from "../../main.js";
import { ErrorPage } from "../ErrorPage.js";

const BASE_PATH = import.meta.env.BASE_URL ? "/front_6th_chapter1-1" : "";

const getAppPath = (fullPath = window.location.pathname) => {
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
};

const getFullPath = (appPath) => {
  return BASE_PATH + appPath;
};

export async function PageRouter() {
  const root = document.getElementById("root");
  const appPath = getAppPath();

  const productDetailMatch = appPath.match(/^\/product\/(\d+)/);
  if (productDetailMatch) {
    const productId = productDetailMatch[1];
    const product = await getProduct(productId);
    const relatedProducts = await getRelatedProducts(product);
    root.innerHTML = ProductDetailPage({ product, relatedProducts });
    attachEvents();
    return;
  }

  // if (appPath === "/non-existent-page") {
  //   root.innerHTML = ErrorPage();
  //   return;
  // }

  // if (appPath === "/front_6th_chapter1-1/") {
  //   // 기본(홈) 페이지
  //   root.innerHTML = HomePage({
  //     // ...state,
  //     // selectedCategory,
  //   });
  //   //attachEvents();
  // }

  if (appPath === "/" || appPath === "/front_6th_chapter1-1/") {
    root.innerHTML = HomePage({});
    return;
  }

  // 그 외 모든 경로는 에러 페이지
  root.innerHTML = ErrorPage();
}

// 내보내기
export { BASE_PATH, getAppPath, getFullPath };
