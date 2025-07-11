// 간단한 상태관리 시스템
// Observer 패턴 사용

// 상태의 변경을 관찰하겠다.
// 변경되면 미리 정의힌 일련의 동작을 실행
class Store {
  constructor() {
    this.state = {
      products: [],
      categories: {},
      pagination: {},
      filters: {},
      loading: false,
      isLoadingMore: false,
      error: null,
    };
    this.listeners = [];
  }

  // 상태 구독
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // 상태 변경 알림
  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  // 상태 업데이트
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }
  setPagination(pagination) {
    this.setState({ pagination, loading: false, error: null });
  }
  setFilters(filters) {
    this.setState({ filters, loading: false, error: null });
  }

  // 로딩 시작
  setLoading(loading) {
    this.setState({ loading, error: null });
  }

  // 상품 설정
  setProducts(products) {
    this.setState({ products, loading: false, error: null });
  }

  setCategories(categories) {
    this.setState({ categories, loading: false, error: null });
  }

  setLoadingMore(isLoadingMore) {
    this.setState({ isLoadingMore });
  }

  addProducts(newProducts) {
    const currentProducts = this.state.products;
    const combinedProducts = [...currentProducts, ...newProducts];
    this.setState({ products: combinedProducts, isLoadingMore: false, error: null });
  }

  canMoreData() {
    const { pagination, isLoadingMore } = this.state;
    return pagination.hasNext && !isLoadingMore;
  }
  // 에러 설정
  setError(error) {
    this.setState({ error, loading: false });
  }

  getFiltersFromURL() {
    const url = new URL(window.location.href);
    return {
      search: url.searchParams.get("search") || "",
      limit: parseInt(url.searchParams.get("limit")) || 20,
      sort: url.searchParams.get("sort") || "price_asc",
      category1: url.searchParams.get("category1") || "",
      category2: url.searchParams.get("category2") || "",
      current: parseInt(url.searchParams.get("current")) || 1,
    };
  }

  updateFilter(key, value) {
    const newFilters = {
      ...this.state.filters,
      [key]: value,
    };
    if (key !== "current") {
      newFilters.current = 1;
    }

    const url = new URL(window.location.href);
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) {
        url.searchParams.set(key, newFilters[key]);
      } else {
        url.searchParams.delete(key);
      }
    });

    window.history.pushState({}, "", url);
    this.setFilters(newFilters);
    return newFilters;
  }

  // 상태 초기화
  reset() {
    this.state = {
      products: [],
      categories: {},
      pagination: {},
      filters: {},
      loading: false,
      isLoadingMore: false,
      error: null,
    };
    this.listeners = [];
  }
}

// 전역 스토어 인스턴스
export const store = new Store();
