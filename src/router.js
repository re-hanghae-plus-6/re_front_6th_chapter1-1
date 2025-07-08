export function getLimitFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const limit = parseInt(urlParams.get("limit"));
  return limit && [10, 20, 50, 100].includes(limit) ? limit : 20;
}

export function updateURLParams(limit) {
  const url = new URL(window.location);
  url.searchParams.set("limit", limit);
  window.history.pushState({}, "", url);
}

// 라우터 초기화
export function initRouter() {
  return {
    getLimitFromURL,
    updateURLParams,
  };
}
