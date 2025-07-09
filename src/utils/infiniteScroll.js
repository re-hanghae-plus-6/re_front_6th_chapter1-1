import { getProducts } from "../api/productApi.js";
import { store } from "../store/store.js";

// 상태 변수들
let currentPage = 1;
let isLoading = false;
let hasMoreData = true;
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
  if (isLoading || !hasMoreData) return;

  const loadingEl = document.getElementById("loading-text");

  try {
    isLoading = true;
    currentPage++;

    const params = getQueryParams();
    const response = await getProducts({ page: currentPage, ...params });

    if (!response.products || response.products.length === 0) {
      hasMoreData = false;
      if (loadingEl) loadingEl.textContent = "모든 상품을 확인했습니다.";
      return;
    }

    const existingProducts = store.state.products;
    const newProducts = response.products;
    const combinedProducts = [...existingProducts, ...newProducts];

    store.setProducts(combinedProducts);
  } catch (error) {
    console.error("무한스크롤 에러:", error);
    hasMoreData = false; // 에러 발생 시 더 이상 시도하지 않음
    if (loadingEl) loadingEl.textContent = "상품을 불러오는데 실패했습니다.";
  } finally {
    isLoading = false;
  }
}

function handleScroll() {
  if (isLoading || !hasMoreData) return;

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const threshold = 100;

  if (scrollTop + windowHeight >= documentHeight - threshold) {
    const loadingEl = document.getElementById("loading-text");
    if (loadingEl) loadingEl.textContent = "상품을 불러오는 중...";
    loadMoreProducts();
  }
}

function createThrottledScrollHandler() {
  let ticking = false;
  return () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
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
}

export function resetInfiniteScroll() {
  currentPage = 1;
  hasMoreData = true;
  isLoading = false;
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
  currentPage = 1;
  hasMoreData = true;
  isLoading = false;
}
