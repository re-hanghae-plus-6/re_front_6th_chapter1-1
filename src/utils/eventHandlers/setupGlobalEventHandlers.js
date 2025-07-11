import { updateQueryParams } from "../queryStringHandler.js";
import { navigateToProduct } from "../router.js";
import { performSearch, clearSearch } from "../searchHandler.js";

export const setupGlobalEventHandlers = (state, renderInitialContent, loadMoreProducts) => {
  setupCategoryEventListeners(state, renderInitialContent);
  setupSortControl(state, renderInitialContent);
  setupProductLimitControl(state, renderInitialContent);
  setupInfiniteScroll(state, loadMoreProducts);
  setupProductCardEventListeners();
  setupSearchEventListeners(state, renderInitialContent);
};

/**
 * 카테고리 필터 이벤트 리스너 설정
 */
const setupCategoryEventListeners = (state, renderInitialContent) => {
  // 1depth 카테고리 버튼 이벤트
  const category1Buttons = document.querySelectorAll(".category1-filter-btn");
  category1Buttons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const category1 = e.target.dataset.category1;

      // 이미 선택된 카테고리라면 선택 해제
      if (state.selectedCategories.category1 === category1) {
        state.selectedCategories = {};
        state.category1 = "";
        state.category2 = "";
        updateQueryParams({ category1: "", category2: "" });
      } else {
        // 새로운 카테고리 선택
        state.selectedCategories = { category1 };
        state.category1 = category1;
        state.category2 = "";
        updateQueryParams({ category1, category2: "" });
      }

      await renderInitialContent();
    });
  });

  // 2depth 카테고리 버튼 이벤트
  const category2Buttons = document.querySelectorAll(".category2-filter-btn");
  category2Buttons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const category2 = e.target.dataset.category2;

      // 이미 선택된 카테고리라면 선택 해제 (1단계로 돌아감)
      if (state.selectedCategories.category2 === category2) {
        state.selectedCategories = { category1: state.selectedCategories.category1 };
        state.category2 = "";
        updateQueryParams({ category2: "" });
      } else {
        // 새로운 카테고리 선택
        state.selectedCategories = {
          category1: state.selectedCategories.category1,
          category2,
        };
        state.category2 = category2;
        updateQueryParams({ category2 });
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
        state.selectedCategories = {};
        state.category1 = "";
        state.category2 = "";
        updateQueryParams({ category1: "", category2: "" });
      } else {
        // 해당 단계까지만 유지
        const index = parseInt(breadcrumbIndex);

        if (index === 1) {
          // 1단계까지만 유지 (2단계 선택 해제)
          state.selectedCategories = { category1: state.selectedCategories.category1 };
          state.category2 = "";
          updateQueryParams({ category2: "" });
        }
      }

      await renderInitialContent();
    });
  });
};

/**
 * 정렬 컨트롤 이벤트 리스너 설정
 */
const setupSortControl = (state, renderInitialContent) => {
  const sortSelect = document.querySelector("#sort-select");
  if (!sortSelect) return;

  sortSelect.value = state.sort;

  sortSelect.addEventListener("change", async (e) => {
    const newSort = e.target.value;
    if (newSort !== state.sort) {
      state.sort = newSort;
      updateQueryParams({ sort: newSort });
      await renderInitialContent();
    }
  });
};

/**
 * 상품 개수 제한 컨트롤 이벤트 리스너 설정
 */
const setupProductLimitControl = (state, renderInitialContent) => {
  const select = document.getElementById("limit-select");
  if (!select) return;

  select.value = String(state.limit);

  select.addEventListener("change", async (e) => {
    const newLimit = parseInt(e.target.value, 10);
    if (!isNaN(newLimit) && newLimit !== state.limit) {
      state.limit = newLimit;
      updateQueryParams({ limit: newLimit });
      await renderInitialContent();
    }
  });
};

/**
 * 무한 스크롤 이벤트 리스너 설정
 */
const setupInfiniteScroll = (state, loadMoreProducts) => {
  if (typeof window === "undefined" || location.pathname !== "/") return;

  if (!import.meta.env.TEST) {
    // 실제 브라우저 환경
    const sentinel = document.createElement("div");
    sentinel.id = "scroll-sentinel";
    sentinel.className = "h-4";
    document.body.appendChild(sentinel);

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreProducts();
      }
    });

    observer.observe(sentinel);
  } else {
    // 테스트 환경에서는 스크롤 이벤트로 처리
    window.addEventListener("scroll", () => {
      if (!state.isLoading && state.hasMore) {
        loadMoreProducts();
      }
    });
  }
};

/**
 * 상품 카드 클릭 이벤트 리스너 설정
 */
const setupProductCardEventListeners = () => {
  // 상품 이미지 클릭 이벤트
  const productImages = document.querySelectorAll(".product-image");
  productImages.forEach((image) => {
    image.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = image.getAttribute("data-product-id");
      if (productId) {
        navigateToProduct(productId);
      }
    });
  });

  // 상품 정보 클릭 이벤트
  const productInfos = document.querySelectorAll(".product-info");
  productInfos.forEach((info) => {
    info.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = info.getAttribute("data-product-id");
      if (productId) {
        navigateToProduct(productId);
      }
    });
  });
};

// 검색 이벤트 리스너 설정 함수
export const setupSearchEventListeners = (state, renderCallback) => {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const clearButton = document.getElementById("clear-search-button");

  if (!searchInput) return;

  // 검색 버튼 클릭 이벤트
  if (searchButton) {
    searchButton.addEventListener("click", () => {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        performSearch(state, searchTerm, renderCallback);
      }
    });
  }

  // Enter 키 이벤트
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        performSearch(state, searchTerm, renderCallback);
      }
    }
  });

  // 검색어 초기화 버튼
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      searchInput.value = "";
      clearSearch(state, renderCallback);
    });
  }
};
