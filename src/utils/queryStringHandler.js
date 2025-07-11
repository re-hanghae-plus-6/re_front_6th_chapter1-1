/**
 * URL 쿼리 스트링을 관리하는 유틸리티 함수들
 */

/**
 * 현재 URL의 쿼리 파라미터를 객체로 반환합니다.
 * @returns {Object} 쿼리 파라미터 객체
 */
export const getQueryParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};

  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }

  return params;
};

/**
 * 쿼리 파라미터를 URL에 업데이트합니다.
 * @param {Object} newParams - 업데이트할 파라미터들
 * @param {boolean} replace - true면 현재 히스토리를 교체, false면 새 히스토리 추가
 */
export const updateQueryParams = (newParams, replace = true) => {
  const currentParams = getQueryParams();
  const updatedParams = { ...currentParams, ...newParams };

  // 빈 값들은 제거
  Object.keys(updatedParams).forEach((key) => {
    if (updatedParams[key] === "" || updatedParams[key] === null || updatedParams[key] === undefined) {
      delete updatedParams[key];
    }
  });

  const searchParams = new URLSearchParams(updatedParams);
  const newUrl = `${window.location.pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`;

  if (replace) {
    window.history.replaceState({}, "", newUrl);
  } else {
    window.history.pushState({}, "", newUrl);
  }
};

/**
 * 특정 쿼리 파라미터를 제거합니다.
 * @param {string|Array} paramsToRemove - 제거할 파라미터명 또는 파라미터명 배열
 */
export const removeQueryParams = (paramsToRemove) => {
  const currentParams = getQueryParams();
  const paramsArray = Array.isArray(paramsToRemove) ? paramsToRemove : [paramsToRemove];

  paramsArray.forEach((param) => {
    delete currentParams[param];
  });

  const searchParams = new URLSearchParams(currentParams);
  const newUrl = `${window.location.pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`;

  window.history.replaceState({}, "", newUrl);
};

/**
 * URL의 쿼리 파라미터를 state 객체로 동기화합니다.
 * @param {Object} state - 동기화할 state 객체
 * @returns {Object} 업데이트된 state 객체
 */
export const syncStateFromQuery = (state) => {
  const params = getQueryParams();

  return {
    ...state,
    page: parseInt(params.page) || 1,
    limit: parseInt(params.limit) || 20,
    sort: params.sort || "price_asc",
    search: params.search || "",
    category1: params.category1 || "",
    category2: params.category2 || "",
  };
};
