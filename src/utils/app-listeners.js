import { router } from "../routes/index.js";
import { productListService, productDetailService, cartService } from "../services/index.js";
import { createProductListPage, createProductDetailPage } from "../pages/index.js";
import { createCartModal } from "../components/cart-modal.js";

/**
 * 상품 목록 서비스 상태 변경 리스너
 */
const handleProductListStateChange = (state) => {
  // 현재 경로가 홈 페이지인 경우에만 상품 목록 렌더링
  if (router.getCurrentPath() === "/") {
    const root = document.getElementById("root");
    if (root) {
      const cartState = cartService.getState();
      root.innerHTML = createProductListPage(state.products, state) + createCartModal(cartState);
      updateCartIcon();
    }
  }
};

/**
 * 상품 상세 서비스 상태 변경 리스너
 */
const handleProductDetailStateChange = (state) => {
  // 현재 경로가 상품 상세 페이지인 경우에만 렌더링
  if (router.getCurrentPath().startsWith("/product/")) {
    const root = document.getElementById("root");
    if (root) {
      const cartState = cartService.getState();
      root.innerHTML = createProductDetailPage(state.product, state.relatedProducts) + createCartModal(cartState);
      updateCartIcon();
    }
  }
};

/**
 * 장바구니 서비스 상태 변경 리스너
 */
const handleCartStateChange = (cartState) => {
  const root = document.getElementById("root");
  if (!root) return;

  // 기존 모달 제거
  const existingModal = root.querySelector(".cart-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // 새 모달 추가
  const modalHTML = createCartModal(cartState);
  if (modalHTML) {
    root.insertAdjacentHTML("beforeend", modalHTML);
  }

  // 장바구니 아이콘 업데이트
  updateCartIcon();
};

/**
 * 장바구니 아이콘 업데이트 함수
 */
const updateCartIcon = () => {
  const cartState = cartService.getState();
  const cartIcon = document.querySelector("#cart-icon-btn");

  if (!cartIcon) return;

  // 기존 카운트 제거
  const existingCount = cartIcon.querySelector("span");
  if (existingCount) {
    existingCount.remove();
  }

  // 새 카운트 추가
  if (cartState.items.length > 0) {
    const countSpan = document.createElement("span");
    countSpan.className =
      "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center";
    countSpan.textContent = cartState.items.length;
    cartIcon.appendChild(countSpan);
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

  // 상품 상세 페이지로 이동했을 때
  if (route && route.path === "/product" && router.getCurrentPath().startsWith("/product/")) {
    const pathParts = router.getCurrentPath().split("/");
    const productId = pathParts[2];
    if (productId) {
      productDetailService.loadProduct(productId);
    }
  }
};

/**
 * 앱 리스너들 설정
 */
export const setupAppListeners = () => {
  // 상품 목록 서비스 렌더링 리스너 등록
  productListService.addListener(handleProductListStateChange);

  // 상품 상세 서비스 렌더링 리스너 등록
  productDetailService.addListener(handleProductDetailStateChange);

  // 장바구니 서비스 렌더링 리스너 등록
  cartService.addListener(handleCartStateChange);

  // 라우터 변경 리스너 등록 (URL 변경 시 상품 목록 로드)
  router.addListener(handleRouteChange);
};

/**
 * 앱 리스너들 해제
 */
export const removeAppListeners = () => {
  // 상품 목록 서비스 리스너 해제
  productListService.removeListener(handleProductListStateChange);

  // 상품 상세 서비스 리스너 해제
  productDetailService.removeListener(handleProductDetailStateChange);

  // 장바구니 서비스 리스너 해제
  cartService.removeListener(handleCartStateChange);

  // 라우터 리스너 해제
  router.removeListener(handleRouteChange);
};
