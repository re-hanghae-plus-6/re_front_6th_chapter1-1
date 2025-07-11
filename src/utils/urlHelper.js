export function getQueryParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    search: urlParams.get("search") || "",
    limit: parseInt(urlParams.get("limit")) || 20,
    sort: urlParams.get("sort") || "price_asc",
    category: urlParams.get("category") || "",
  };
}

export function updateQueryParams(params) {
  const urlParams = new URLSearchParams(window.location.search);

  // 파라미터 업데이트
  Object.entries(params).forEach(([key, value]) => {
    if (value === "" || value === null || value === undefined) {
      urlParams.delete(key);
    } else {
      urlParams.set(key, value);
    }
  });

  // URL 업데이트 (히스토리에 추가하지 않고 현재 URL만 변경)
  const newUrl = `${window.location.pathname}${urlParams.toString() ? "?" + urlParams.toString() : ""}`;
  window.history.replaceState(null, "", newUrl);
}

export function buildQueryString(params) {
  const filteredParams = Object.entries(params)
    .filter(([, value]) => value !== "" && value !== null && value !== undefined)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  return new URLSearchParams(filteredParams).toString();
}
