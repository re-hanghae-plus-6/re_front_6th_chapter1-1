import { updateParamsWithPageReset, getURLParams } from "./utils/urlParams.js";

let infiniteScrollObserver = null;

/**
 * 상품 목록 페이지 이벤트 등록
 */
export const registerProductEvents = (productService) => {
  const currentParams = getURLParams();

  // 페이지당 상품 수 선택 이벤트
  const limitSelect = document.querySelector("#limit-select");
  if (!limitSelect) return;

  limitSelect.value = currentParams.limit;
  limitSelect.onchange = (e) => {
    const newLimit = parseInt(e.target.value);
    updateParamsWithPageReset({ limit: newLimit });
    productService.loadProducts();
  };

  // 정렬 옵션 선택 이벤트
  const sortSelect = document.querySelector("#sort-select");
  if (!sortSelect) return;

  sortSelect.value = currentParams.sort;
  sortSelect.onchange = (e) => {
    const newSort = e.target.value;
    updateParamsWithPageReset({ sort: newSort });
    productService.loadProducts();
  };

  // 검색 이벤트
  const searchInput = document.querySelector("#search-input");

  if (!searchInput) return;
  searchInput.value = currentParams.search;
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const searchTerm = e.target.value.trim();
      updateParamsWithPageReset({ search: searchTerm });
      productService.loadProducts();
    }
  });
};

/**
 * 무한스크롤 이벤트 등록
 */
export const registerInfiniteScroll = (productService) => {
  // 기존 observer 정리
  if (infiniteScrollObserver) {
    infiniteScrollObserver.disconnect();
    infiniteScrollObserver = null;
  }

  const sentinel = document.querySelector("#scroll-sentinel");
  if (!sentinel) return;

  const options = {
    root: null,
    rootMargin: "200px",
    threshold: 0.01,
  };

  infiniteScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        productService.loadMoreProducts();
      }
    });
  }, options);

  infiniteScrollObserver.observe(sentinel);
};

/**
 * 브라우저 이벤트 등록
 */
export const registerBrowserEvents = (productService) => {
  window.addEventListener("popstate", () => {
    productService.loadProducts();
  });
};

/**
 * 모든 이벤트 등록
 */
export const registerAllEvents = (store, productService) => {
  registerProductEvents(productService);
  registerInfiniteScroll(productService);
  registerBrowserEvents(productService);
};
