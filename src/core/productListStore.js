import store from "./store.js";
import { syncStateFromQuery } from "../utils/queryStringHandler.js";

const initialState = {
  page: 1,
  limit: 20,
  sort: "price_asc",
  search: "",
  category1: "",
  category2: "",
  isLoading: false,
  hasMore: true,
  products: [],
  categories: {},
  selectedCategories: {},
  totalProducts: 0,
};

// URL 쿼리 파라미터로 초기 상태 동기화
const initialSyncState = syncStateFromQuery(initialState);

// 스토어 초기화
store.reset(initialSyncState);

class ProductListStore {
  constructor() {
    this.store = store;
  }

  /**
   * 현재 상태를 가져옵니다
   */
  getState() {
    return this.store.getState();
  }

  /**
   * 상태를 업데이트합니다
   */
  setState(updater) {
    this.store.setState(updater);
  }

  /**
   * 특정 상태만 업데이트합니다
   */
  setStateByKey(key, value) {
    this.store.setStateByKey(key, value);
  }

  /**
   * 상태 변경을 구독합니다
   */
  subscribe(callback) {
    return this.store.subscribe(callback);
  }

  /**
   * 페이지 상태 업데이트
   */
  setPage(page) {
    this.setStateByKey("page", page);
  }

  /**
   * 로딩 상태 업데이트
   */
  setLoading(isLoading) {
    this.setStateByKey("isLoading", isLoading);
  }

  /**
   * 상품 목록 업데이트
   */
  setProducts(products) {
    this.setStateByKey("products", products);
  }

  /**
   * 카테고리 업데이트
   */
  setCategories(categories) {
    this.setStateByKey("categories", categories);
  }

  /**
   * 선택된 카테고리 업데이트
   */
  setSelectedCategories(selectedCategories) {
    this.setStateByKey("selectedCategories", selectedCategories);
  }

  /**
   * 검색어 업데이트
   */
  setSearch(search) {
    this.setStateByKey("search", search);
  }

  /**
   * 정렬 방식 업데이트
   */
  setSort(sort) {
    this.setStateByKey("sort", sort);
  }

  /**
   * 상품 개수 제한 업데이트
   */
  setLimit(limit) {
    this.setStateByKey("limit", limit);
  }

  /**
   * 더 많은 상품이 있는지 여부 업데이트
   */
  setHasMore(hasMore) {
    this.setStateByKey("hasMore", hasMore);
  }

  /**
   * 전체 상품 개수 업데이트
   */
  setTotalProducts(totalProducts) {
    this.setStateByKey("totalProducts", totalProducts);
  }

  /**
   * 카테고리1 업데이트
   */
  setCategory1(category1) {
    this.setStateByKey("category1", category1);
  }

  /**
   * 카테고리2 업데이트
   */
  setCategory2(category2) {
    this.setStateByKey("category2", category2);
  }

  /**
   * 상품 목록에 상품 추가 (무한 스크롤용)
   */
  addProducts(newProducts) {
    const currentProducts = this.getState().products;
    this.setProducts([...currentProducts, ...newProducts]);
  }

  /**
   * 상태 초기화 (테스트용)
   */
  reset() {
    if (import.meta.env.TEST) {
      this.store.reset(initialState);
    }
  }

  /**
   * 필터 상태 초기화
   */
  resetFilters() {
    this.setState({
      page: 1,
      search: "",
      category1: "",
      category2: "",
      selectedCategories: {},
      hasMore: true,
      products: [],
    });
  }

  /**
   * 검색 상태 초기화
   */
  resetSearch() {
    this.setState({
      search: "",
      page: 1,
      hasMore: true,
      products: [],
    });
  }

  /**
   * 카테고리 필터 초기화
   */
  resetCategories() {
    this.setState({
      category1: "",
      category2: "",
      selectedCategories: {},
      page: 1,
      hasMore: true,
      products: [],
    });
  }
}

// 싱글톤 인스턴스 생성
const productListStore = new ProductListStore();

export default productListStore;
