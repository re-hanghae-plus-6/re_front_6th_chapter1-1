import { productListPage } from "../pages/productListPage";
import { productDetailPage } from "../pages/productDetailPage";
import { get404Page } from "../pages/404Page";

// 경로별 라우팅 처리 함수
const handleRoute = async (path) => {
  // 상품 상세 페이지 라우팅
  if (path.startsWith("/product/")) {
    const productId = path.split("/product/")[1];
    if (productId) {
      await productDetailPage(productId);
      return;
    }
  }

  // 루트 경로 또는 기타 경로는 상품 목록 페이지로
  if (path === "/" || path === "") {
    await productListPage();
    return;
  }

  // 404 페이지
  document.body.innerHTML = get404Page();
};

// 라우터 초기화 함수
export const initializeRouter = async () => {
  // 초기 라우팅 실행
  await handleRoute(window.location.pathname);

  // 브라우저 뒤로가기/앞으로가기 처리
  window.addEventListener("popstate", async () => {
    await handleRoute(window.location.pathname);
  });

  // 링크 클릭 처리 (SPA 동작)
  document.addEventListener("click", async (e) => {
    const link = e.target.closest("a[data-link]");
    if (link) {
      e.preventDefault();
      const href = link.getAttribute("href");
      window.history.pushState({}, "", href);
      await handleRoute(href);
    }
  });
};

// 프로그래매틱 네비게이션 함수들
export const navigateTo = async (path) => {
  window.history.pushState({}, "", path);
  await handleRoute(path);
};

export const navigateToProduct = async (productId) => {
  await navigateTo(`/product/${productId}`);
};

export const navigateToHome = async () => {
  await navigateTo("/");
};

// 현재 경로 확인 함수
export const getCurrentPath = () => {
  return window.location.pathname;
};

// 상품 ID 추출 함수
export const extractProductId = (path) => {
  if (path.startsWith("/product/")) {
    return path.split("/product/")[1];
  }
  return null;
};

// 경로 유효성 검사 함수
export const isValidRoute = (path) => {
  // 루트 경로
  if (path === "/" || path === "") {
    return true;
  }

  // 상품 상세 페이지 경로
  if (path.startsWith("/product/")) {
    const productId = path.split("/product/")[1];
    return productId && productId.length > 0;
  }

  return false;
};
