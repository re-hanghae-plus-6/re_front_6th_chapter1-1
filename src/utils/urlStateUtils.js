// URL 상태 변환 유틸리티 함수들
// 애플리케이션 상태를 URL 쿼리 파라미터로 변환하거나 그 반대를 수행

export const stateToQueryParams = (state) => {
  const params = {};

  if (state.searchValue) params.search = state.searchValue;
  if (state.selectedCategory1) params.category1 = state.selectedCategory1;
  if (state.selectedCategory2) params.category2 = state.selectedCategory2;
  if (state.selectedSort && state.selectedSort !== "price_asc") params.sort = state.selectedSort;
  if (state.selectedLimit && state.selectedLimit !== "20") params.limit = state.selectedLimit;
  if (state.currentPage && state.currentPage !== 1) params.page = state.currentPage;

  return params;
};

export const queryParamsToState = (params) => {
  return {
    searchValue: params.search || "",
    selectedCategory1: params.category1 || "",
    selectedCategory2: params.category2 || "",
    selectedSort: params.sort || "price_asc",
    selectedLimit: params.limit || "20",
    currentPage: parseInt(params.page) || 1,
  };
};
