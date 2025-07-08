import { getProducts } from "../api/index.js";
import { urlManager } from "../utils/index.js";

/**
 * 상품 목록 서비스
 */
export class ProductListService {
  constructor() {
    this.products = [];
    this.totalCount = 0;
    this.isLoading = false;
    this.currentPage = 1;
    this.hasMore = true;
    this.listeners = [];
  }

  /**
   * 상태 변경 리스너 추가
   */
  addListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * 상태 변경 알림
   */
  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.getState()));
  }

  /**
   * 현재 상태 반환
   */
  getState() {
    return {
      products: this.products,
      totalCount: this.totalCount,
      isLoading: this.isLoading,
      currentPage: this.currentPage,
      hasMore: this.hasMore,
      searchValue: urlManager.getParam("search", ""),
      selectedLimit: urlManager.getParam("limit", "20"),
      selectedSort: urlManager.getParam("sort", "price_asc"),
      selectedCategory1: urlManager.getParam("category1", ""),
      selectedCategory2: urlManager.getParam("category2", ""),
    };
  }

  /**
   * URL 파라미터에서 현재 필터 상태 가져오기
   */
  getFiltersFromURL() {
    return {
      search: urlManager.getParam("search", ""),
      limit: parseInt(urlManager.getParam("limit", "20")),
      sort: urlManager.getParam("sort", "price_asc"),
      category1: urlManager.getParam("category1", ""),
      category2: urlManager.getParam("category2", ""),
      page: parseInt(urlManager.getParam("page", "1")),
    };
  }

  /**
   * 상품 목록 로드
   */
  async loadProducts(resetPage = false) {
    this.isLoading = true;
    this.notifyListeners();

    try {
      const filters = this.getFiltersFromURL();

      if (resetPage) {
        this.currentPage = 1;
        this.products = [];
        urlManager.setParam("page", "1");
        urlManager.updateURL();
      }

      const response = await getProducts({
        ...filters,
        page: this.currentPage,
      });

      if (this.currentPage === 1) {
        this.products = response.products;
      } else {
        this.products = [...this.products, ...response.products];
      }

      this.totalCount = response.pagination.total;
      this.hasMore = response.pagination.hasNext;
      this.isLoading = false;

      this.notifyListeners();
    } catch (error) {
      this.isLoading = false;
      this.notifyListeners();
      throw error;
    }
  }

  /**
   * 다음 페이지 로드 (무한 스크롤)
   */
  async loadNextPage() {
    if (this.isLoading || !this.hasMore) return;

    this.currentPage++;
    urlManager.setParam("page", this.currentPage.toString());
    urlManager.replaceURL();

    await this.loadProducts(false);
  }

  /**
   * 검색
   */
  async search(searchValue) {
    urlManager.setParam("search", searchValue);
    urlManager.setParam("page", "1");
    urlManager.updateURL();

    await this.loadProducts(true);
  }

  /**
   * 정렬 변경
   */
  async changeSort(sortValue) {
    urlManager.setParam("sort", sortValue);
    urlManager.setParam("page", "1");
    urlManager.updateURL();

    await this.loadProducts(true);
  }

  /**
   * 페이지당 상품 수 변경
   */
  async changeLimit(limitValue) {
    urlManager.setParam("limit", limitValue);
    urlManager.setParam("page", "1");
    urlManager.updateURL();

    await this.loadProducts(true);
  }

  /**
   * 카테고리 필터 변경
   */
  async changeCategory(category1, category2 = "") {
    urlManager.setParam("category1", category1);
    urlManager.setParam("category2", category2);
    urlManager.setParam("page", "1");
    urlManager.updateURL();

    await this.loadProducts(true);
  }

  /**
   * 필터 초기화
   */
  async resetFilters() {
    urlManager.clearParams();
    urlManager.updateURL();

    await this.loadProducts(true);
  }
}

// 전역 인스턴스
export const productListService = new ProductListService();
