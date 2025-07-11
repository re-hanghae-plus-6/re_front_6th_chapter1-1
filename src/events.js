import { updateURLParams, getURLParams } from "./utils/urlParams.js";

/**
 * 상품 목록 페이지 이벤트 등록
 */
export const registerProductEvents = (productService) => {
  // 페이지당 상품 수 선택
  const limitSelect = document.querySelector("#limit-select");
  if (!limitSelect) return;

  limitSelect.value = getURLParams().limit;
  limitSelect.onchange = (e) => {
    updateURLParams({ limit: parseInt(e.target.value), page: 1 });
    productService.loadProducts();
  };

  // 정렬 옵션 선택
  const sortSelect = document.querySelector("#sort-select");
  if (!sortSelect) return;

  sortSelect.value = getURLParams().sort;
  sortSelect.onchange = (e) => {
    updateURLParams({ sort: e.target.value, page: 1 });
    productService.loadProducts();
  };
};

/**
 * 브라우저 이벤트 등록
 */
export const registerBrowserEvents = (productService) => {
  // 뒤로가기/앞으로가기 처리
  window.addEventListener("popstate", () => {
    productService.loadProducts();
  });
};

/**
 * 모든 이벤트 등록 (메인 함수)
 */
export const registerAllEvents = (store, productService) => {
  registerProductEvents(productService);
  registerBrowserEvents(productService);
};
