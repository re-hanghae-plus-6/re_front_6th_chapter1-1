import { getProducts } from "../api/index.js";
import { searchParams } from "../routes/index.js";

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
      searchValue: searchParams.get("search", ""),
      selectedLimit: searchParams.get("limit", "20"),
      selectedSort: searchParams.get("sort", "price_asc"),
      selectedCategory1: searchParams.get("category1", ""),
      selectedCategory2: searchParams.get("category2", ""),
    };
  }

  /**
   * URL 파라미터에서 현재 필터 상태 가져오기
   */
  getFiltersFromURL() {
    return {
      search: searchParams.get("search", ""),
      limit: parseInt(searchParams.get("limit", "20")),
      sort: searchParams.get("sort", "price_asc"),
      category1: searchParams.get("category1", ""),
      category2: searchParams.get("category2", ""),
      page: parseInt(searchParams.get("page", "1")),
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
        // 리스너 트리거 방지를 위해 직접 URL 업데이트
        const url = new URL(window.location);
        url.searchParams.set("page", "1");
        window.history.replaceState(null, "", url.toString());
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
    // 리스너 트리거 방지를 위해 직접 URL 업데이트
    const url = new URL(window.location);
    url.searchParams.set("page", this.currentPage.toString());
    window.history.replaceState(null, "", url.toString());

    await this.loadProducts(false);
  }

  /**
   * 검색
   */
  async search(searchValue) {
    searchParams.setAll({
      search: searchValue,
      page: "1",
    });

    await this.loadProducts(true);
  }

  /**
   * 정렬 변경
   */
  async changeSort(sortValue) {
    searchParams.setAll({
      sort: sortValue,
      page: "1",
    });

    await this.loadProducts(true);
  }

  /**
   * 페이지당 상품 수 변경
   */
  async changeLimit(limitValue) {
    searchParams.setAll({
      limit: limitValue,
      page: "1",
    });

    await this.loadProducts(true);
  }

  /**
   * 카테고리 필터 변경
   */
  async changeCategory(category1, category2 = "") {
    searchParams.setAll({
      category1: category1,
      category2: category2,
      page: "1",
    });

    await this.loadProducts(true);
  }

  /**
   * 필터 초기화
   */
  async resetFilters() {
    searchParams.clear();
    await this.loadProducts(true);
  }
}

// 전역 인스턴스
export const productListService = new ProductListService();
