import { productListPage } from "../pages/productListPage";
import { productDetailPage } from "../pages/productDetailPage";
import { get404Page } from "../pages/404Page";

// 공통 BASE_PATH 정의
const BASE_PATH = import.meta.env.MODE === "production" ? "/front_6th_chapter1-1" : "";

// path에서 BASE_PATH를 제거
const stripBasePath = (path) => (path.startsWith(BASE_PATH) ? path.slice(BASE_PATH.length) : path);

// 경로별 라우팅 처리 함수
const handleRoute = async (rawPath) => {
  const path = stripBasePath(rawPath) || "/";

  if (path.startsWith("/product/")) {
    const productId = path.split("/product/")[1];
    if (productId) {
      await productDetailPage(productId);
      return;
    }
  }

  if (path === "/" || path === "") {
    await productListPage();
    return;
  }

  document.body.innerHTML = get404Page();
};

// 라우터 초기화 함수
export const initializeRouter = async () => {
  await handleRoute(window.location.pathname);

  window.addEventListener("popstate", async () => {
    await handleRoute(window.location.pathname);
  });

  document.addEventListener("click", async (e) => {
    const link = e.target.closest("a[data-link]");
    if (link) {
      e.preventDefault();
      const href = link.getAttribute("href");
      const fullPath = BASE_PATH + href;
      window.history.pushState({}, "", fullPath);
      await handleRoute(fullPath);
    }
  });
};

// 프로그래매틱 네비게이션 함수들
export const navigateTo = async (path) => {
  const fullPath = BASE_PATH + path;
  if (window.location.pathname === fullPath) return;
  window.history.pushState({}, "", fullPath);
  await handleRoute(fullPath);
};

export const navigateToProduct = async (productId) => {
  const path = `/product/${productId}`;
  await navigateTo(path);
};

export const navigateToHome = async () => {
  await navigateTo("/");
};

export const goBack = async () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    await navigateToHome();
  }
};

// 현재 경로 확인 함수
export const getCurrentPath = () => {
  return stripBasePath(window.location.pathname);
};

// 상품 ID 추출 함수
export const extractProductId = (path) => {
  const cleaned = stripBasePath(path);
  return cleaned.startsWith("/product/") ? cleaned.split("/product/")[1] : null;
};

// 경로 유효성 검사 함수
export const isValidRoute = (path) => {
  const cleaned = stripBasePath(path);
  if (cleaned === "/" || cleaned === "") return true;
  if (cleaned.startsWith("/product/")) {
    const productId = cleaned.split("/product/")[1];
    return productId && productId.length > 0;
  }
  return false;
};
