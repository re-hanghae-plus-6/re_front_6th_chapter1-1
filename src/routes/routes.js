import { createProductListPage, createProductDetailPage } from "../pages/index.js";
import { productListService, productDetailService } from "../services/index.js";

/**
 * 상품 목록 페이지 컴포넌트
 */
const ProductListPageComponent = () => {
  const state = productListService.getState();

  return createProductListPage(state.products, state);
};

/**
 * 상품 상세 페이지 컴포넌트
 */
const ProductDetailPageComponent = () => {
  const pathParts = window.location.pathname.split("/");
  const productId = pathParts[2];

  if (!productId) {
    return `
      <div style="text-align: center; padding: 50px;">
        <h1>잘못된 상품 ID입니다</h1>
        <button onclick="router.navigate('/')">홈으로 돌아가기</button>
      </div>
    `;
  }

  const state = productDetailService.getState();
  return createProductDetailPage(state.product, state.relatedProducts);
};

/**
 * 홈 페이지 (상품 목록으로 리다이렉트)
 */
const HomePageComponent = () => {
  return ProductListPageComponent();
};

/**
 * 애플리케이션 라우트 설정
 */
export const routes = [
  {
    path: "/",
    component: HomePageComponent,
    options: { exact: true },
  },
  {
    path: "/product",
    component: ProductDetailPageComponent,
    options: { exact: false },
  },
];

/**
 * 라우트 설정 초기화
 */
export const initializeRoutes = (router) => {
  router.addRoutes(routes);
};
