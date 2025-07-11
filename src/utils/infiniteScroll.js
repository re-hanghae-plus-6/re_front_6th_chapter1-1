import { getProducts } from "../api/productApi.js";
import { store } from "../store/store.js";

// 상태 변수들

let scrollHandler = null;

// URL에서 쿼리 파라미터를 가져오는 헬퍼 함수
function getQueryParams() {
  const queryParams = new URLSearchParams(window.location.search);
  const params = {
    limit: queryParams.get("limit") || "20",
    sort: queryParams.get("sort") || "price_asc",
    search: queryParams.get("search") || "",
    category1: queryParams.get("category1") || "",
    category2: queryParams.get("category2") || "",
  };
  Object.keys(params).forEach((key) => {
    if (params[key] === "") {
      delete params[key];
    }
  });
  return params;
}

async function loadMoreProducts() {
  const { state } = store;
  if (state.isLoadingMore) return;

  store.setLoadingMore(true);

  const loadingEl = document.getElementById("loading-text");
  if (loadingEl) loadingEl.textContent = "상품을 불러오는 중...";

  try {
    const params = getQueryParams();
    console.log(state.pagination);
    const currentPage = state.pagination?.page || 1;
    const response = await getProducts({ page: currentPage + 1, ...params });
    if (loadingEl) loadingEl.textContent = "상품을 불러오는 중...";
    if (!response.products || response.products.length === 0) {
      store.setPagination({ ...store.state.pagination, hasNext: false });
      return;
    }
    // const existingProducts = store.state.products;
    // const newProducts = response.products;
    // const combinedProducts = [...existingProducts, ...newProducts];

    store.addProducts(response.products);
    store.setPagination(response.pagination);
    if (loadingEl) {
      loadingEl.textContent = response.pagination?.hasNext ? "" : "모든 상품을 불러왔습니다.";
    }
  } catch (error) {
    console.error("무한스크롤 에러:", error);

    if (loadingEl) loadingEl.textContent = "상품을 불러오는데 실패했습니다.";
  } finally {
    store.setLoadingMore(false);
  }
}

function handleScroll() {
  if (store.state.isLoadingMore) return;

  const scrollTop = document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const threshold = 500;

  // const loadingEl = document.getElementById("loading-text");
  // if (loadingEl) loadingEl.textContent = "상품을 불러오는 중...";
  if (scrollTop + windowHeight >= documentHeight - threshold) {
    loadMoreProducts();
  }
}

function createThrottledScrollHandler() {
  let ticking = false;
  return () => {
    if (!ticking) {
      const isPlaywright = window.navigator && window.navigator.webdriver;

      if (isPlaywright) {
        setTimeout(() => {
          handleScroll();
          ticking = false;
        }, 16);
      } else {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
      }
      ticking = true;
    }
  };
}

export function infiniteScroll() {
  if (scrollHandler) {
    window.removeEventListener("scroll", scrollHandler);
  }
  scrollHandler = createThrottledScrollHandler();
  window.addEventListener("scroll", scrollHandler);
  console.log("스크롤 이벤트 리스너 등록됨"); // ← 이 로그도 확인
}

export function resetInfiniteScroll() {
  const loadingEl = document.getElementById("loading-text");
  if (loadingEl) {
    loadingEl.textContent = "스크롤하여 더 많은 상품 보기";
  }
}

export function cleanupInfiniteScroll() {
  if (scrollHandler) {
    window.removeEventListener("scroll", scrollHandler);
    scrollHandler = null;
  }

  // 🔥 Playwright 관련 정리
  if (window.infiniteScrollInterval) {
    clearInterval(window.infiniteScrollInterval);
    window.infiniteScrollInterval = null;
  }

  // 🔥 전역 함수들 정리
  delete window.loadMoreProducts;
  delete window.triggerInfiniteScroll;
  delete window.forceLoadMore;
}
