import { productListService } from "../services/index.js";
import { router } from "../routes/index.js";

/**
 * 검색 이벤트 핸들러
 */
export const handleSearchKeydown = async (e) => {
  if (e.target.id === "search-input" && e.key === "Enter") {
    await productListService.search(e.target.value);
  }
};

/**
 * 정렬 및 옵션 변경 이벤트 핸들러
 */
export const handleOptionChange = async (e) => {
  if (e.target.id === "sort-select") {
    await productListService.changeSort(e.target.value);
  }
  if (e.target.id === "limit-select") {
    await productListService.changeLimit(e.target.value);
  }
};

/**
 * 카테고리 및 브레드크럼 클릭 이벤트 핸들러
 */
export const handleCategoryClick = async (e) => {
  // 카테고리 1단계 필터
  if (e.target.classList.contains("category1-filter-btn")) {
    const category1 = e.target.dataset.category1;
    await productListService.changeCategory(category1);
    return;
  }

  // 카테고리 2단계 필터
  if (e.target.classList.contains("category2-filter-btn")) {
    const category1 = e.target.dataset.category1;
    const category2 = e.target.dataset.category2;
    await productListService.changeCategory(category1, category2);
    return;
  }

  // 브레드크럼 리셋
  if (e.target.dataset.breadcrumb === "reset") {
    await productListService.resetFilters();
    return;
  }

  // 브레드크럼 카테고리1 클릭
  if (e.target.dataset.breadcrumb === "category1") {
    const category1 = e.target.dataset.category1;
    await productListService.changeCategory(category1);
    return;
  }
};

/**
 * 무한 스크롤 이벤트 핸들러
 */
export const handleInfiniteScroll = async () => {
  // 홈 페이지에서만 무한 스크롤 활성화
  if (router.getCurrentPath() !== "/") {
    return;
  }

  // 페이지 하단 근처 도달 시 다음 페이지 로드
  const isNearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000;

  if (isNearBottom) {
    await productListService.loadNextPage();
  }
};
