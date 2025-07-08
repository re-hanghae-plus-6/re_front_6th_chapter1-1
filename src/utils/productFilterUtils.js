import { loadProductList, loadFilter } from "../services/productLoader";
import { getProductListFilters, updateUrlParams } from "./searchUtils";

// 정렬 옵션
export const SORT_OPTIONS = [
  { value: "price_asc", label: "가격 낮은순" },
  { value: "price_desc", label: "가격 높은순" },
  { value: "name_asc", label: "이름순" },
  { value: "name_desc", label: "이름 역순" },
];

// 페이지당 상품 수 옵션
export const LIMIT_OPTIONS = [
  { value: "10", label: "10개" },
  { value: "20", label: "20개" },
  { value: "50", label: "50개" },
  { value: "100", label: "100개" },
];

/**
 * 옵션 배열을 HTML select 옵션으로 렌더링
 * @param {Array} options - 옵션 배열 [{value, label}]
 * @param {string} selectedValue - 현재 선택된 값
 * @returns {string} - HTML 옵션 문자열
 */
export const renderOptions = (options, selectedValue) => {
  return options
    .map(
      (option) =>
        `<option value="${option.value}" ${selectedValue === option.value ? "selected" : ""}>${option.label}</option>`,
    )
    .join("");
};

/** 검색어 입력 후 엔터 누르면 검색 */
export const handleSearchSubmit = (e) => {
  if (e.target.id === "search-input" && e.key === "Enter") {
    // 검색어 추출
    const keyword = e.target.value.trim();

    updateUrlParams({ key: "search", value: keyword });
    loadProductList(getProductListFilters());
  }
};

/** 정렬 변경 이벤트 핸들러 */
export const handleSortChange = (e) => {
  if (e.target.id === "sort-select") {
    updateUrlParams({ key: "sort", value: e.target.value });
    loadProductList(getProductListFilters());
  }
};

/** 개수 변경 이벤트 핸들러 */
export const handleLimitChange = (e) => {
  if (e.target.id === "limit-select") {
    updateUrlParams({ key: "limit", value: e.target.value });
    loadProductList(getProductListFilters());
  }
};

export const handleCategoryClick = (e) => {
  const target = e.target;

  if (!target.matches("[data-category1]")) return;

  const category1 = target.dataset.category1;
  const category2 = target.dataset.category2;

  if (category2) {
    // 카테고리 2Depth 선택
    updateUrlParams({ key: "category1", value: category1, resetPage: true });
    updateUrlParams({ key: "category2", value: category2, resetPage: true });
  } else {
    // 카테고리 1Depth 선택 (2Depth 초기화)
    updateUrlParams({ key: "category1", value: category1, resetPage: true });
    updateUrlParams({ key: "category2", value: "", resetPage: true });
  }

  const query = getProductListFilters();
  loadFilter(query);
  loadProductList(query);
};

/** 브레드크럼 클릭 이벤트 핸들러 */
export const handleBreadcrumbClick = (e) => {
  const target = e.target;

  if (!target.matches("[data-breadcrumb]")) return;

  const breadcrumbType = target.dataset.breadcrumb;

  if (breadcrumbType === "reset") {
    // 전체로 돌아가기 (모든 카테고리 초기화)
    updateUrlParams({ key: "category1", value: "", resetPage: true });
    updateUrlParams({ key: "category2", value: "", resetPage: true });
  } else if (breadcrumbType === "category1") {
    // 상위 카테고리로 돌아가기 (category2만 초기화)
    const category1 = target.dataset.category1;
    updateUrlParams({ key: "category1", value: category1, resetPage: true });
    updateUrlParams({ key: "category2", value: "", resetPage: true });
  }

  const query = getProductListFilters();
  loadFilter(query);
  loadProductList(query);
};

/**
 * 필터 이벤트 리스너 등록
 */
export const initializeFilterEventListeners = () => {
  // 기존 리스너 제거 (중복 방지)
  document.removeEventListener("change", handleFilterChange);
  document.removeEventListener("keydown", handleSearchSubmit);
  document.removeEventListener("click", handleCategoryClick);
  document.removeEventListener("click", handleBreadcrumbClick);

  // 새로운 리스너 등록
  document.addEventListener("change", handleFilterChange);
  document.addEventListener("keydown", handleSearchSubmit);
  document.addEventListener("click", handleCategoryClick);
  document.addEventListener("click", handleBreadcrumbClick);
};

/**
 * 통합 필터 변경 핸들러
 */
function handleFilterChange(e) {
  handleSortChange(e);
  handleLimitChange(e);
}
