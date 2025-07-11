// URL 파라미터 파싱 함수
export function getURLParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    limit: parseInt(params.get("limit")) || 20,
    current: parseInt(params.get("current")) || 1,
    sort: params.get("sort") || "price_asc",
    search: params.get("search") || "",
  };
}

// URL 업데이트 함수
export function updateURLParams(params) {
  const currentParams = getURLParams();
  const newParams = { ...currentParams, ...params };
  const queryString = new URLSearchParams(newParams).toString();
  const newURL = `${window.location.pathname}?${queryString}`;
  window.history.pushState({}, "", newURL);
}
