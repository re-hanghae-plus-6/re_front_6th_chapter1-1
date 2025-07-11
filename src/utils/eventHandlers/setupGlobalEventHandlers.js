import { updateQueryParams } from "../queryStringHandler.js";
import { navigateToProduct } from "../router.js";
import { performSearch, clearSearch } from "../searchHandler.js";
import productListStore from "../../core/productListStore.js";
import { setupCartEventListeners } from "../cartHandler.js";

export const setupGlobalEventHandlers = (renderInitialContent, loadMoreProducts) => {
  setupCategoryEventListeners(renderInitialContent);
  setupSortControl(renderInitialContent);
  setupProductLimitControl(renderInitialContent);
  setupInfiniteScroll(loadMoreProducts);
  setupProductCardEventListeners();
  setupSearchEventListeners(renderInitialContent);
  setupCartEventListeners();
};

/**
 * 카테고리 필터 이벤트 리스너 설정
 */
const setupCategoryEventListeners = (renderInitialContent) => {
  // 1depth 카테고리 버튼 이벤트
  const category1Buttons = document.querySelectorAll(".category1-filter-btn");
  category1Buttons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const category1 = e.target.dataset.category1;
      const state = productListStore.getState();

      // 이미 선택된 카테고리라면 선택 해제
      if (state.selectedCategories.category1 === category1) {
        productListStore.setSelectedCategories({});
        productListStore.setCategory1("");
        productListStore.setCategory2("");
        updateQueryParams({ category1: "", category2: "" }, true);
      } else {
        // 새로운 카테고리 선택
        productListStore.setSelectedCategories({ category1 });
        productListStore.setCategory1(category1);
        productListStore.setCategory2("");
        updateQueryParams({ category1, category2: "" }, true);
      }

      await renderInitialContent();
    });
  });

  // 2depth 카테고리 버튼 이벤트
  const category2Buttons = document.querySelectorAll(".category2-filter-btn");
  category2Buttons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const category2 = e.target.dataset.category2;
      const state = productListStore.getState();

      // 이미 선택된 카테고리라면 선택 해제 (1단계로 돌아감)
      if (state.selectedCategories.category2 === category2) {
        productListStore.setSelectedCategories({ category1: state.selectedCategories.category1 });
        productListStore.setCategory2("");
        updateQueryParams({ category2: "" }, true);
      } else {
        // 새로운 카테고리 선택
        productListStore.setSelectedCategories({
          category1: state.selectedCategories.category1,
          category2,
        });
        productListStore.setCategory2(category2);
        updateQueryParams({ category2 }, true);
      }

      await renderInitialContent();
    });
  });

  // 브레드크럼 이벤트
  const breadcrumbButtons = document.querySelectorAll("[data-breadcrumb]");
  breadcrumbButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const breadcrumbIndex = e.target.dataset.breadcrumb;

      if (breadcrumbIndex === "reset") {
        // 전체로 돌아가기
        productListStore.setSelectedCategories({});
        productListStore.setCategory1("");
        productListStore.setCategory2("");
        updateQueryParams({ category1: "", category2: "" }, true);
      } else {
        // 해당 단계까지만 유지
        const index = parseInt(breadcrumbIndex);
        const state = productListStore.getState();

        if (index === 1) {
          // 1단계까지만 유지 (2단계 선택 해제)
          productListStore.setSelectedCategories({ category1: state.selectedCategories.category1 });
          productListStore.setCategory2("");
          updateQueryParams({ category2: "" }, true);
        }
      }

      await renderInitialContent();
    });
  });
};

/**
 * 정렬 컨트롤 이벤트 리스너 설정
 */
const setupSortControl = (renderInitialContent) => {
  const sortSelect = document.querySelector("#sort-select");
  if (!sortSelect) return;

  const state = productListStore.getState();
  sortSelect.value = state.sort;

  sortSelect.addEventListener("change", async (e) => {
    const newSort = e.target.value;
    if (newSort !== state.sort) {
      productListStore.setSort(newSort);
      updateQueryParams({ sort: newSort }, true);
      await renderInitialContent();
    }
  });
};

/**
 * 상품 개수 제한 컨트롤 이벤트 리스너 설정
 */
const setupProductLimitControl = (renderInitialContent) => {
  const select = document.getElementById("limit-select");
  if (!select) return;

  const state = productListStore.getState();
  select.value = String(state.limit);

  select.addEventListener("change", async (e) => {
    const newLimit = parseInt(e.target.value, 10);
    if (!isNaN(newLimit) && newLimit !== state.limit) {
      productListStore.setLimit(newLimit);
      updateQueryParams({ limit: newLimit }, true);
      await renderInitialContent();
    }
  });
};

/**
 * 무한 스크롤 이벤트 리스너 설정
 */
const setupInfiniteScroll = (loadMoreProducts) => {
  let isThrottled = false;
  const throttleDelay = 100;

  const handleScroll = () => {
    // 상품 목록 페이지에서만 무한 스크롤 활성화
    const isProductListPage = window.location.pathname === "/" || window.location.pathname === "";
    if (!isProductListPage) return;

    if (isThrottled) return;

    isThrottled = true;
    setTimeout(() => {
      isThrottled = false;
    }, throttleDelay);

    const state = productListStore.getState();

    if (state.isLoading || !state.hasMore) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 스크롤이 페이지 하단 80%에 도달했을 때 다음 페이지 로드
    if (scrollTop + windowHeight >= documentHeight * 0.8) {
      loadMoreProducts();
    }
  };

  window.addEventListener("scroll", handleScroll);
};

/**
 * 상품 카드 이벤트 리스너 설정
 */
const setupProductCardEventListeners = () => {
  // 썸네일(이미지) 클릭 이벤트 (상세 페이지로 이동)
  document.addEventListener("click", (e) => {
    const productImage = e.target.closest(".product-image");
    if (productImage) {
      e.stopPropagation(); // 이벤트 버블링 방지
      const productId = productImage.dataset.productId;
      if (productId) {
        navigateToProduct(productId);
      }
    }
  });

  // 장바구니 버튼 클릭 이벤트
  document.addEventListener("click", (e) => {
    const addToCartBtn = e.target.closest(".add-to-cart-btn");
    if (addToCartBtn) {
      e.stopPropagation(); // 이벤트 버블링 방지

      const productCard = addToCartBtn.closest(".product-card");
      if (productCard) {
        const productData = JSON.parse(productCard.dataset.product);
        if (productData) {
          // 장바구니에 추가 (cartHandler의 addToCart 함수 사용)
          import("../cartHandler.js").then(({ addToCart }) => {
            addToCart(productData);
          });
        }
      }
    }
  });
};

// 검색 이벤트 리스너 설정 함수
export const setupSearchEventListeners = (renderCallback) => {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const clearButton = document.getElementById("clear-search-button");

  if (!searchInput) return;

  // 검색 버튼 클릭 이벤트
  if (searchButton) {
    searchButton.addEventListener("click", () => {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        performSearch(searchTerm, renderCallback);
      }
    });
  }

  // Enter 키 이벤트
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        performSearch(searchTerm, renderCallback);
      }
    }
  });

  // 검색어 초기화 버튼
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      searchInput.value = "";
      clearSearch(renderCallback);
    });
  }
};
