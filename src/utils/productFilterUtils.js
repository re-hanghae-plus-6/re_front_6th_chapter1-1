import { loadProductList } from "../services/productLoader";
import { getProductListFilters } from "./searchUtils";

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

/**
 * URL 파라미터 업데이트
 * @param {string} key - 파라미터 키
 * @param {string} value - 파라미터 값
 * @param {boolean} resetPage - 페이지를 1로 리셋할지 여부
 */
export const updateUrlParams = (key, value, resetPage = false) => {
  const params = new URLSearchParams(window.location.search);
  params.set(key, value);

  if (resetPage) {
    params.set("page", "1");
  }

  const nextURL = `${window.location.pathname}?${params.toString()}`;
  history.pushState({}, "", nextURL);
};

/** 정렬 변경 이벤트 핸들러 */
export const handleSortChange = (e) => {
  if (e.target.id === "sort-select") {
    const sort = e.target.value;
    updateUrlParams("sort", sort, true); // 정렬 변경시 페이지 리셋
    loadProductList(getProductListFilters());
  }
};

/** 개수 변경 이벤트 핸들러 */
export const handleLimitChange = (e) => {
  if (e.target.id === "limit-select") {
    const limit = e.target.value;
    updateUrlParams("limit", limit, true); // 개수 변경시 페이지 리셋
    loadProductList(getProductListFilters());
  }
};

/**
 * 필터 이벤트 리스너 등록
 */
export const initializeFilterEventListeners = () => {
  // 기존 리스너 제거 (중복 방지)
  document.removeEventListener("change", handleFilterChange);
  // 새로운 리스너 등록
  document.addEventListener("change", handleFilterChange);
};

/**
 * 통합 필터 변경 핸들러
 */
function handleFilterChange(e) {
  handleSortChange(e);
  handleLimitChange(e);
}
