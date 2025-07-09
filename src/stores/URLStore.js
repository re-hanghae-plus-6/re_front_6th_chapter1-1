// 함수형 URLStore
function createURLStore() {
  let listeners = [];

  // 구독자 등록
  function subscribe(listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  // 상태 변경 알림
  function notify() {
    listeners.forEach((listener) => listener());
  }

  // URL 파라미터 읽기
  function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      category1: params.get("category1") || "",
      category2: params.get("category2") || "",
      search: params.get("search") || "",
      sort: params.get("sort") || "price_asc",
      limit: parseInt(params.get("limit")) || 20,
      page: parseInt(params.get("page")) || 1,
    };
  }

  // URL 파라미터 업데이트
  function updateURL(newParams) {
    const url = new URL(window.location);

    // 기존 파라미터 제거
    url.searchParams.delete("category1");
    url.searchParams.delete("category2");
    url.searchParams.delete("search");
    url.searchParams.delete("sort");
    url.searchParams.delete("limit");
    url.searchParams.delete("page");

    // 새 파라미터 추가 (값이 있을 때만)
    if (newParams.category1) url.searchParams.set("category1", newParams.category1);
    if (newParams.category2) url.searchParams.set("category2", newParams.category2);
    if (newParams.search) url.searchParams.set("search", newParams.search);
    if (newParams.sort && newParams.sort !== "price_asc") url.searchParams.set("sort", newParams.sort);
    if (newParams.limit && newParams.limit !== 20) url.searchParams.set("limit", newParams.limit.toString());
    if (newParams.page && newParams.page !== 1) url.searchParams.set("page", newParams.page.toString());

    window.history.pushState({}, "", url);
    notify();
  }

  // URL 초기화 (홈으로)
  function resetURL() {
    window.history.pushState({}, "", "/");
    notify();
  }

  // 공개 API 반환
  return {
    subscribe,
    getQueryParams,
    updateURL,
    resetURL,
  };
}

export const urlStore = createURLStore();
