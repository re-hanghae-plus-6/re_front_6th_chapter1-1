import { MainPage } from "../pages/MainPage.js";

export async function Router() {
<<<<<<< HEAD
=======
  const hash = window.location;
  console.log(hash);
>>>>>>> 91f244e (feat : product store구현 완료)
  //   if (hash.startsWith("#/product/")) {
  //     const productId = hash.split("/")[2];
  //     return ProductDetailPage(productId);
  //   }
  // 기본: 메인 페이지
<<<<<<< HEAD

=======
>>>>>>> 91f244e (feat : product store구현 완료)
  return await MainPage();
}
