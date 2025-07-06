/**
 * 현재 URL의 쿼리 파라미터를 가져와 상품 목록 필터 객체로 반환
 * @returns {{
 *   page: number,
 *   limit: number,
 *   search: string,
 *   category1: string,
 *   category2: string,
 *   sort: string
 * }} 상품 목록 필터 객체
 */
export function getProductListFilters() {
  const searchParams = new URLSearchParams(location.search);
  return {
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 20,
    sort: searchParams.get("sort") || "price_asc",
    search: searchParams.get("search") || "",
    category1: searchParams.get("category1") || "",
    category2: searchParams.get("category2") || "",
  };
}

/**
 * 필터를 URL에 반영
 * @param {Object} filterParams - 업데이트할 필터 파라미터
 */
export function updateURLFilters(filterParams) {
  const searchParams = new URLSearchParams();
  Object.entries(filterParams).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      searchParams.set(key, value);
    }
  });

  const newURL = `${location.pathname}?${searchParams.toString()}`;
  history.pushState({}, "", newURL);
}
