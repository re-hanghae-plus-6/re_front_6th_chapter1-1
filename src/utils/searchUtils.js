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
 * URL 파라미터 업데이트
 * @param {string} key - 파라미터 키
 * @param {string} value - 파라미터 값
 * @param {boolean} resetPage - 페이지를 1로 리셋할지 여부
 */
export const updateUrlParams = ({ key, value, resetPage = true }) => {
  const params = new URLSearchParams(window.location.search);

  // 빈 값이면 파라미터를 제거하고, 아니면 설정
  if (!value || value.trim() === "") {
    params.delete(key);
  } else {
    params.set(key, value);
  }

  if (resetPage) {
    params.set("page", "1");
  }

  // // 빈 값의 파라미터들을 모두 제거
  // for (const [paramKey, paramValue] of params.entries()) {
  //   if (!paramValue || paramValue.trim() === "") {
  //     params.delete(paramKey);
  //   }
  // }

  const nextURL = `${window.location.pathname}?${params.toString()}`;
  history.pushState({}, "", nextURL);
};
