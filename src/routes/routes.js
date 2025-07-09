import { createProductListPage } from "../pages/index.js";
import { productListService } from "../services/index.js";

/**
 * 상품 목록 페이지 컴포넌트
 */
const ProductListPageComponent = () => {
  // 자동으로 loadProducts를 호출하지 않음 (main.js에서 관리)
  // productListService.loadProducts(true); // 제거

  // 현재 상태 가져오기
  const state = productListService.getState();

  return createProductListPage(state.products, state);
};

/**
 * 상품 상세 페이지 컴포넌트
 */
const ProductDetailPageComponent = () => {
  // URL에서 상품 ID 추출
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

  // TODO: 상품 상세 페이지 구현
  return `
    <div style="text-align: center; padding: 50px;">
      <h1>상품 상세 페이지</h1>
      <p>상품 ID: ${productId}</p>
      <button onclick="router.navigate('/')">상품 목록으로 돌아가기</button>
    </div>
  `;
};

/**
 * 홈 페이지 (상품 목록으로 리다이렉트)
 */
const HomePageComponent = () => {
  // 홈 페이지 접근 시 상품 목록 페이지로 리다이렉트하지 않음
  // setTimeout(() => {
  //   window.router.navigate('/', { replace: true });
  // }, 0);

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
    options: { exact: false }, // /product/123 형태도 매칭
  },
];

/**
 * 라우트 설정 초기화
 */
export const initializeRoutes = (router) => {
  router.addRoutes(routes);
};
