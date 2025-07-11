import { updateURLParams, getURLParams } from "./utils/urlParams.js";

// Observer 인스턴스를 모듈 레벨에서 관리 (전역 오염 방지)
let infiniteScrollObserver = null;

/**
 * 상품 목록 페이지 이벤트 등록
 */
export const registerProductEvents = (productService) => {
  const currentParams = getURLParams();

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

  // 검색 이벤트
  const searchInput = document.querySelector("#search-input");
  if (searchInput) {
    // 현재 검색어 표시
    searchInput.value = currentParams.search;

    // Enter 키 이벤트
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const searchTerm = e.target.value.trim();
        updateURLParams({ search: searchTerm, page: 1 });
        productService.loadProducts();
      }
    });
  }
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
  registerInfiniteScroll(productService);
  registerBrowserEvents(productService);
};
