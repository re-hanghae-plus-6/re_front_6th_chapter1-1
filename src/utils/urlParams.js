// URL 파라미터 파싱 함수
export function getURLParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    limit: parseInt(params.get("limit")) || 20,
    page: parseInt(params.get("page")) || 1,
    sort: params.get("sort") || "price_asc",
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
