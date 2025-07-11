import mainStore from "../store/main.js";
import { getAppPath, getFullPath } from "./path.js";

// URL 쿼리스트링 파싱 함수
const getURLParams = () => {
  const params = new URLSearchParams(window.location.search);

  return {
    limit: params.get("limit") ? parseInt(params.get("limit")) : 20,
    sort: params.get("sort") || "price_asc",
    search: params.get("search") || "",
    category1: params.get("category1") || "",
    category2: params.get("category2") || "",
  };
};

/**
 *
 * @param {Object} newParams
 * @returns {URLSearchParams}
 */
const mergeURLParams = (newParams) => {
  const currentParams = getURLParams();
  const mergedParams = { ...currentParams, ...newParams };

  // 빈 값 제거
  Object.keys(mergedParams).forEach((key) => {
    if (!mergedParams[key] || mergedParams[key] === "") {
      delete mergedParams[key];
    }
  });

  const urlParams = new URLSearchParams();
  Object.entries(mergedParams).forEach(([key, value]) => {
    if (value) urlParams.set(key, value);
  });

  return urlParams;
};

// URL 업데이트 함수 (새로고침 없이)
const updateURL = (newParams) => {
  const params = mergeURLParams(newParams);
  const currentAppPath = getAppPath();

  const newURL = `${getFullPath(currentAppPath)}${params.toString() ? "?" + params.toString() : ""}`;
  window.history.pushState({}, "", newURL);

  mainStore.setParams(Object.fromEntries(params.entries()));
};

export { getURLParams, mergeURLParams, updateURL };
