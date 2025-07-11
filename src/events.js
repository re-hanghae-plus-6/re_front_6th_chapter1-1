import { actions } from "./stores/actions.js";
import { updateParamsWithPageReset, getURLParams } from "./utils/urlParams.js";

// 중복 등록 방지 및 리소스 관리
let infiniteScrollObserver = null;
let linkEventsRegistered = false;

/**
 * 라우팅 관련 이벤트
 */
export const registerLinkEvents = (router) => {
  if (linkEventsRegistered) return;

  document.addEventListener("click", (e) => {
    // 링크 클릭 처리
    const link = e.target.closest("a");
    if (link) {
      const href = link.getAttribute("href");
      if (href && href.startsWith("/")) {
        e.preventDefault();
        router.navigate(href);
        return;
      }
    }

    // 상품 카드 클릭 처리
    const productCard = e.target.closest(".product-card") || e.target.closest(".related-product-card");
    if (!productCard || e.target.closest("button")) return;

    const productId = productCard.dataset.productId;
    if (!productId) return;

    e.preventDefault();
    router.navigate(`/product/${productId}`);
  });

  linkEventsRegistered = true;
};

/**
 * 상품 목록 페이지 이벤트
 */
export const registerProductEvents = (productService) => {
  const currentParams = getURLParams();

  // 1. 페이지당 상품 수 선택
  const limitSelect = document.querySelector("#limit-select");
  if (!limitSelect) return;

  limitSelect.value = currentParams.limit;
  limitSelect.onchange = (e) => {
    const newLimit = parseInt(e.target.value);
    updateParamsWithPageReset({ limit: newLimit });
    productService.loadProducts();
  };

  // 2. 정렬 옵션 선택
  const sortSelect = document.querySelector("#sort-select");
  if (!sortSelect) return;

  sortSelect.value = currentParams.sort;
  sortSelect.onchange = (e) => {
    const newSort = e.target.value;
    updateParamsWithPageReset({ sort: newSort });
    productService.loadProducts();
  };

  // 3. 검색 기능 (Enter 키)
  const searchInput = document.querySelector("#search-input");
  if (!searchInput) return;

  searchInput.value = currentParams.search;
  searchInput.addEventListener("keypress", (e) => {
    if (e.key !== "Enter") return;

    const searchTerm = e.target.value.trim();
    updateParamsWithPageReset({ search: searchTerm });
    productService.loadProducts();
  });
};

/**
 * 무한스크롤 이벤트
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
 * 상품 상세 페이지 이벤트 등록
 */
export const registerProductDetailEvents = () => {
  const quantityIncrease = document.querySelector("#quantity-increase");
  const quantityDecrease = document.querySelector("#quantity-decrease");
  const quantityInput = document.querySelector("#quantity-input");

  if (quantityIncrease && quantityDecrease && quantityInput) {
    // 1. 수량 증가
    quantityIncrease.onclick = () => {
      const currentValue = parseInt(quantityInput.value);
      const maxValue = parseInt(quantityInput.max);

      if (currentValue < maxValue) {
        quantityInput.value = currentValue + 1;
      }
    };

    // 2. 수량 감소
    quantityDecrease.onclick = () => {
      const currentValue = parseInt(quantityInput.value);
      const minValue = parseInt(quantityInput.min);

      if (currentValue > minValue) {
        quantityInput.value = currentValue - 1;
      }
    };

    // 3. 직접 입력 시 유효성 검사
    quantityInput.addEventListener("input", (e) => {
      const value = parseInt(e.target.value);
      const minValue = parseInt(e.target.min);
      const maxValue = parseInt(e.target.max);

      if (value < minValue) {
        e.target.value = minValue;
      } else if (value > maxValue) {
        e.target.value = maxValue;
      }
    });
  }
};

/**
 * 장바구니 이벤트
 */
export const registerCartEvents = (store) => {
  const { dispatch } = store;

  document.addEventListener("click", (e) => {
    const addToCartBtn = e.target.closest(".add-to-cart-btn");
    if (!addToCartBtn) return;

    e.preventDefault();

    const productId = addToCartBtn.dataset.productId;
    if (!productId) return;

    dispatch(actions.addToCart(productId));
  });
};

/**
 * 모든 이벤트 등록
 */
export const registerAllEvents = (store, productService, router) => {
  const state = store.getState();

  // 전역 이벤트
  registerLinkEvents(router);
  registerCartEvents(store);

  // 페이지별 이벤트
  if (state.route.name === "ProductList") {
    registerProductEvents(productService);
    registerInfiniteScroll(productService);
  } else if (state.route.name === "ProductDetail") {
    registerProductDetailEvents();
  }
};
