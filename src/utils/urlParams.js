/**
 * 기본값 설정
 */
const DEFAULT_PARAMS = {
  limit: 20,
  current: 1,
  sort: "price_asc",
  search: "",
};

/**
 * URL 파라미터 파싱 함수
 */
export const getURLParams = (defaults = DEFAULT_PARAMS) => {
  const url = new URL(window.location);
  const params = {};

  Object.keys(defaults).forEach((key) => {
    const value = url.searchParams.get(key);
    if (value !== null) {
      const defaultValue = defaults[key];
      if (typeof defaultValue === "number") {
        params[key] = parseInt(value) || defaultValue;
      } else {
        params[key] = value;
      }
    } else {
      params[key] = defaults[key];
    }
  });

  return params;
};

/**
 * URL 업데이트 함수
 */
export const updateURLParams = (newParams, defaults = DEFAULT_PARAMS, callback) => {
  const url = new URL(window.location);

  Object.entries(newParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });

  window.history.pushState({}, "", url);

  if (callback) {
    callback(getURLParams(defaults));
  }
};

/**
 * 특정 파라미터만 업데이트
 */
export function updateSingleParam(key, value, options = {}) {
  const { replace = false, callback } = options;
  updateURLParams({ [key]: value }, DEFAULT_PARAMS, callback);

  if (replace) {
    // replace가 필요한 경우 replaceState 사용
    const url = new URL(window.location);
    window.history.replaceState({}, "", url);
  }
}

/**
 * 첫 페이지로 리셋하면서 파라미터 업데이트
 */
export function updateParamsWithPageReset(params) {
  updateURLParams({ ...params, current: 1 }, DEFAULT_PARAMS);
}
