import { MainPage } from "../pages/MainPage.js";

export async function Router() {
  const hash = window.location;
  console.log(hash);
  //   if (hash.startsWith("#/product/")) {
  //     const productId = hash.split("/")[2];
  //     return ProductDetailPage(productId);
  //   }
  // 기본: 메인 페이지
  return await MainPage();
}
