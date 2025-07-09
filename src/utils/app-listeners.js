import { router } from "../routes/index.js";
import { productListService } from "../services/index.js";
import { createProductListPage } from "../pages/index.js";

/**
 * 상품 목록 서비스 상태 변경 리스너
 */
const handleProductListStateChange = (state) => {
  // 현재 경로가 홈 페이지인 경우에만 상품 목록 렌더링
  if (router.getCurrentPath() === "/") {
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = createProductListPage(state.products, state);
    }
  }
};

/**
 * 라우터 변경 리스너
 */
const handleRouteChange = (route) => {
  if (route && route.path === "/" && router.getCurrentPath() === "/") {
    // 홈 페이지로 이동했을 때만 상품 목록 로드
    productListService.loadProducts(true);
  }
};

/**
 * 앱 리스너들 설정
 */
export const setupAppListeners = () => {
  // 상품 목록 서비스 렌더링 리스너 등록
  productListService.addListener(handleProductListStateChange);

  // 라우터 변경 리스너 등록 (URL 변경 시 상품 목록 로드)
  router.addListener(handleRouteChange);
};

/**
 * 앱 리스너들 해제
 */
export const removeAppListeners = () => {
  // 상품 목록 서비스 리스너 해제
  productListService.removeListener(handleProductListStateChange);

  // 라우터 리스너 해제
  router.removeListener(handleRouteChange);
};
