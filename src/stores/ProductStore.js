import { getProducts } from "../api/productApi.js";
import { createObservable } from "./observable.js";

// 함수형 ProductStore
function createProductStore() {
  // private 상태
  let products = [];
  let newlyLoadedProducts = []; // 새로 로드된 상품들을 추적
  let total = 0;
  let limit = 20;
  let sort = "price_asc";
  let search = "";
  let page = 1;
  let hasMore = true;
  let loading = false;
  let isFirstLoad = true;

  // 옵저버 패턴 생성
  const observable = createObservable();

  // 상품 목록 로드
  async function loadProducts(params = {}) {
    loading = true;
    total = 0;
    observable.notify();

    try {
      const {
        products: newProducts,
        pagination: { total: newTotal },
      } = await getProducts({
        current: page,
        limit,
        sort,
        search,
        category1: params.category1 || "",
        category2: params.category2 || "",
        ...params,
      });

      products = newProducts;
      total = newTotal;
      hasMore = newProducts.length < newTotal;
      isFirstLoad = false;
    } catch (error) {
      console.error("상품 로드 실패:", error);
      products = [];
      total = 0;
      hasMore = false;
    } finally {
      loading = false;
      observable.notify();
    }
  }

  // 추가 상품 로드 (무한 스크롤)
  async function loadMoreProducts(params = {}) {
    if (loading || !hasMore) return;

    loading = true;
    page += 1;
    newlyLoadedProducts = []; // 새로 로드된 상품 초기화
    observable.notify();

    try {
      const {
        products: newProducts,
        pagination: { hasNext },
      } = await getProducts({
        current: page,
        limit,
        sort,
        search,
        category1: params.category1 || "",
        category2: params.category2 || "",
        ...params,
      });

      products = [...products, ...newProducts];
      newlyLoadedProducts = newProducts; // 새로 로드된 상품들 저장
      hasMore = hasNext;
    } catch (error) {
      console.error("추가 상품 로드 실패:", error);
      hasMore = false;
    } finally {
      loading = false;
      observable.notify();
    }
  }

  // 검색어 변경
  function setSearch(searchTerm) {
    search = searchTerm;
    resetPagination();
    observable.notify();
  }

  // 정렬 변경
  function setSort(sortType) {
    sort = sortType;
    resetPagination();
    observable.notify();
  }

  // 페이지당 아이템 수 변경
  function setLimit(newLimit) {
    limit = newLimit;
    resetPagination();
    observable.notify();
  }

  // 페이지네이션 초기화
  function resetPagination() {
    page = 1;
    products = [];
    newlyLoadedProducts = [];
    hasMore = true;
  }

  // 새로 로드된 상품들 반환 및 초기화
  function getAndClearNewlyLoadedProducts() {
    const result = [...newlyLoadedProducts];
    newlyLoadedProducts = [];
    return result;
  }

  // 전체 상태 초기화
  function reset() {
    products = [];
    newlyLoadedProducts = [];
    total = 0;
    limit = 20;
    sort = "price_asc";
    search = "";
    page = 1;
    hasMore = true;
    loading = false;
    isFirstLoad = true;
    observable.notify();
  }

  // URL 파라미터에서 상태 복원
  function setFromURLParams(params) {
    search = params.search || "";
    sort = params.sort || "price_asc";
    limit = params.limit || 20;
    page = params.page || 1; // URLStore에서 current를 page로 변환해서 전달
    resetPagination();
    observable.notify();
  }

  // 현재 상태 반환
  function getState() {
    return {
      products,
      newlyLoadedProducts,
      total,
      limit,
      sort,
      search,
      page,
      hasMore,
      loading,
      isFirstLoad,
    };
  }

  // 공개 API 반환
  return {
    subscribe: observable.subscribe,
    loadProducts,
    loadMoreProducts,
    setSearch,
    setSort,
    setLimit,
    resetPagination,
    reset,
    setFromURLParams,
    getState,
    getAndClearNewlyLoadedProducts,
  };
}

export const productStore = createProductStore();
