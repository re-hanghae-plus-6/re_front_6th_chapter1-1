import { ProductDetailPage } from "../pages/ProductDetailPage.js";
import { ProductDetailWaitPage } from "../pages/ProductDetailWaitPage.js";
import { NotFoundPage } from "../pages/NotFoundPage.js";
import { Footer } from "../pages/Footer.js";

export const routes = [
  {
    path: /^\/$/,
    action: () => {
      // 메인 페이지는 main.js에서 상태와 함께 렌더링하므로 여기서는 빈 함수
      return;
    },
  },
  {
    path: /^\/product\/(\d+)$/,
    action: (match) => {
      const productId = match[1];
      const root = document.getElementById("root");

      // 먼저 로딩 화면 표시
      root.innerHTML = ProductDetailWaitPage();

      // 바로 상품 페이지 로드 시작 (API pending -> 로딩, resolved -> 데이터 표시)
      ProductDetailPage({ productId });
    },
  },
  {
    path: /.*/,
    action: () => {
      const root = document.getElementById("root");
      root.innerHTML = `
        ${NotFoundPage()}
        ${Footer()}
      `;
    },
  },
];
