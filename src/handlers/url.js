// URL 쿼리 스트링 관리 함수들
export function updateUrlParams(params) {
  const url = new URL(window.location);

  // 기존 파라미터들 제거 (상품 관련)
  const keysToRemove = ["limit", "page", "sort", "search", "category1", "category2"];
  keysToRemove.forEach((key) => url.searchParams.delete(key));

  // 새로운 파라미터들 추가 (값이 있는 경우만)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  // URL 업데이트 (페이지 새로고침 없이)
  window.history.pushState({}, "", url.toString());
}

export function getSearchFromUrl() {
  const path = window.location.pathname;
  const searchMatch = path.match(/^\/search=(.+)$/);
  if (searchMatch) {
    return decodeURIComponent(searchMatch[1]);
  }
  return "";
}
