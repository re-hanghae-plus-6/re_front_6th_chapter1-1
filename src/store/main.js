/** 초기 상태 정의
 * * @typedef {Object} State
 * @property {Array} products - 상품 목록
 * @property {number} total - 전체 상품 수
 * @property {boolean} loading - 로딩 상태
 * @property {Object} categories - 카테고리 목록
 * @property {Object} params - URL 파라미터 상태
 * @property {Object} pagination - 페이지네이션 상태
 */
const initialState = {
  products: [],
  total: 0,
  loading: false,
  loadingMore: false,
  categories: {},
  params: {
    // limit: 20, // 페이지당 상품 수
    // sort: "price_asc", // 정렬 기준
    // search: "", // 검색어
    // category1: "", // 1차 카테고리 필터
    // category2: "", // 2차 카테고리 필터
  },
  pagination: {
    page: 1,
    limit: 20,
    hasNext: true,
  },
  openCart: false, // 장바구니 다이얼로그 열림 상태
  currentProduct: null, // 현재 보고 있는 상품 상세
  relatedProducts: [], // 관련 상품 목록
  selectedQuantity: 1, // 상품 상세에서 선택한 수량
};

// Store 클래스 정의
class Store {
  constructor(initialState) {
    this.state = { ...initialState };
    this.listeners = [];
  }

  // 상태 구독 (변경 시 콜백 실행)
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

  // 전체 상태 getter
  getState() {
    return { ...this.state };
  }

  // 개별 상태 getter들
  getProducts() {
    return this.state.products;
  }

  getTotal() {
    return this.state.total;
  }

  getLoading() {
    return this.state.loading;
  }

  getLoadingMore() {
    return this.state.loadingMore;
  }

  getCategories() {
    return this.state.categories;
  }

  getParams() {
    return this.state.params;
  }

  getPagination() {
    return this.state.pagination;
  }

  getCurrentProduct() {
    return this.state.currentProduct;
  }

  getRelatedProducts() {
    return this.state.relatedProducts;
  }

  getSelectedQuantity() {
    return this.state.selectedQuantity;
  }

  openCart() {
    this.state.openCart = true;
    this.notify();
  }

  // 개별 상태 setter들
  setProducts(products) {
    this.state.products = products;
    this.notify();
  }

  appendProducts(products) {
    this.state.products = [...this.state.products, ...products];
    this.notify();
  }

  setTotal(total) {
    this.state.total = total;
    this.notify();
  }

  setLoading(loading) {
    this.state.loading = loading;
    this.notify();
  }

  setLoadingMore(loadingMore) {
    this.state.loadingMore = loadingMore;
    this.notify();
  }

  setCategories(categories) {
    this.state.categories = categories;
    this.notify();
  }

  setParams(params) {
    this.state.params = { ...this.state.params, ...params };
    this.notify();
  }

  setPagination(pagination) {
    this.state.pagination = { ...this.state.pagination, ...pagination };
    this.notify();
  }

  setCurrentProduct(product) {
    this.state.currentProduct = product;
    this.notify();
  }

  setRelatedProducts(products) {
    this.state.relatedProducts = products;
    this.notify();
  }

  setSelectedQuantity(quantity) {
    this.state.selectedQuantity = quantity;
    this.notify();
  }

  closeCart() {
    this.state.openCart = false;
    this.notify();
  }

  // 복합 액션들
  updateProductsData({ products, total, pagination, append = false }) {
    if (append) {
      this.appendProducts(products);
    } else {
      this.setProducts(products);
    }
    this.setTotal(total);
    this.setPagination(pagination);
  }

  resetPagination() {
    this.setPagination({
      page: 1,
      limit: this.state.pagination.limit,
      hasNext: true,
    });
  }

  incrementPage() {
    this.setPagination({
      page: this.state.pagination.page + 1,
    });
  }

  // 상태 초기화
  reset() {
    this.state = { ...initialState };
    this.notify();
  }
}

// Store 인스턴스 생성 및 내보내기
const store = new Store(initialState);

export default store;
