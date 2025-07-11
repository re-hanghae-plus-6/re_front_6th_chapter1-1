import StateManager from "./StateManager.js";
import { getProducts } from "../api/productApi.js";
import { DEFAULT_SORT, DEFAULT_LIMIT } from "../constant.js";

class ProductListManager extends StateManager {
  constructor() {
    super();
    /** 상품 관련 상태 정의 */
    this.state = {
      /** @type {Array} 현재 로드된 상품 목록 */
      products: [],
      /** @type {number} 전체 상품 수 (페이징을 위한 정보) */
      totalProducts: 0,
      /** @type {boolean} 로딩 상태 */
      loading: true,
      /** @type {string|null} 에러 메시지 (에러가 없으면 null) */
      error: null,
      /** @type {string} 검색어 */
      searchQuery: "",
      /** @type {string} 카테고리 */
      category: "",
      /** @type {string} 정렬 방식 */
      sort: DEFAULT_SORT,
      /** @type {number} 페이지당 상품 수 */
      pageSize: DEFAULT_LIMIT,
      /** @type {number} 현재 페이지 (무한 스크롤용) */
      currentPage: 1,
      /** @type {boolean} 추가 로딩 중 상태 (무한 스크롤용) */
      isLoadingMore: false,
      /** @type {boolean} 더 불러올 상품이 있는지 여부 */
      hasMore: true,
    };
  }

  /**
   * 상품 목록과 전체 상품 수 설정
   * @param {Array} products - 상품 배열
   * @param {number} [totalProducts] - 전체 상품 수 (선택적)
   *
   * @example
   * // 상품 목록만 설정
   * stateManager.product.setProducts([...products]);
   *
   * // 상품 목록과 전체 수 함께 설정
   * stateManager.product.setProducts([...products], 150);
   */
  setProducts(products, totalProducts) {
    this.setState({
      products,
      ...(totalProducts !== undefined && { totalProducts }),
    });
    this.updateHasMore();
  }

  /**
   * 에러 상태 설정
   * @param {string|null} error - 에러 메시지
   *
   * @example
   * stateManager.product.setError('상품을 불러오는데 실패했습니다.');
   * stateManager.product.setError(null); // 에러 제거
   */
  setError(error) {
    this.setState({ error });
  }

  /**
   * 로딩 상태 설정
   * @param {boolean} loading - 로딩 상태
   *
   * @example
   * stateManager.product.setLoading(true); // 로딩 시작
   * stateManager.product.setLoading(false); // 로딩 완료
   */
  setLoading(loading) {
    this.setState({ loading });
  }

  /**
   * 추가 로딩 상태 설정 (무한 스크롤용)
   * @param {boolean} isLoadingMore - 추가 로딩 상태
   */
  setIsLoadingMore(isLoadingMore) {
    console.log("setIsLoadingMore", isLoadingMore);
    this.setState({ isLoadingMore });
  }

  /**
   * hasMore 상태 업데이트
   * 현재 로드된 상품 수와 전체 상품 수를 비교하여 더 불러올 상품이 있는지 확인
   */
  updateHasMore() {
    const hasMore = this.state.products.length < this.state.totalProducts;
    this.setState({ hasMore });
  }

  /**
   * 상품 목록 추가로 로드 (무한 스크롤용)
   * @param {Array} newProducts - 추가할 상품 배열
   * @param {number} [totalProducts] - 전체 상품 수 (선택적)
   *
   * @example
   * stateManager.product.appendProducts([...newProducts], 150);
   */
  appendProducts(newProducts, totalProducts) {
    const currentProducts = this.state.products;
    const updatedProducts = [...currentProducts, ...newProducts];
    this.setState({
      products: updatedProducts,
      ...(totalProducts !== undefined && { totalProducts }),
    });
    this.updateHasMore();
  }

  /**
   * 검색 및 필터 조건 설정
   * @param {Object} filters - 필터 조건 객체
   * @param {string} [filters.searchQuery] - 검색어
   * @param {string} [filters.category] - 카테고리
   * @param {string} [filters.sort] - 정렬 방식
   * @param {number} [filters.pageSize] - 페이지당 상품 수
   * @param {boolean} [reset=true] - 기존 상품 목록 초기화 여부
   */
  setFilters(filters = {}, reset = true) {
    // 검색 조건이 변경되었는지 확인
    const hasChanged = Object.keys(filters).some(
      (key) => filters[key] !== undefined && this.state[key] !== filters[key],
    );

    if (!hasChanged && reset) return false;

    // 상태 업데이트
    const newState = { ...filters };
    this.setState(newState);
    return true; // 변경 여부를 반환
  }

  /**
   * 필터 조건 적용 및 상품 로드 (전체 플로우 관리)
   * @param {Object} filters - 필터 조건 객체
   * @param {boolean} [reset=true] - 기존 상품 목록 초기화 여부
   */
  async applyFilters(filters = {}, reset = true) {
    const hasChanged = this.setFilters(filters, reset);
    if (!hasChanged && reset) return;
    await this.loadProducts();
    this.updateUrl();
  }

  /**
   * 상품 로드
   * @param {boolean} [reset=true] - 기존 상품 목록 초기화 여부
   */
  async loadProducts(reset = true) {
    this.setLoading(true);

    // 새로운 검색/필터 조건일 때 페이지 리셋
    if (reset) {
      this.setState({ currentPage: 1 });
    }

    try {
      const filters = {
        limit: this.state.pageSize,
        search: this.state.searchQuery,
        category1: this.state.category.split(">")[0]?.trim() || "",
        category2: this.state.category.split(">")[1]?.trim() || "",
        sort: this.state.sort,
        page: reset ? 1 : this.state.currentPage,
      };
      const response = await getProducts(filters);
      this.setProducts(response.products, response.pagination.total);
      this.setError(null);
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * 다음 페이지 상품을 로드합니다 (무한 스크롤용)
   */
  async loadMoreProducts() {
    if (this.state.loading || this.state.isLoadingMore || !this.state.hasMore) {
      return;
    }

    this.setIsLoadingMore(true);
    const nextPage = this.state.currentPage + 1;

    try {
      const filters = {
        limit: this.state.pageSize,
        search: this.state.searchQuery,
        category1: this.state.category.split(">")[0]?.trim() || "",
        category2: this.state.category.split(">")[1]?.trim() || "",
        sort: this.state.sort,
        page: nextPage,
      };

      const response = await getProducts(filters);
      this.appendProducts(response.products, response.pagination.total);
      this.setState({ currentPage: nextPage });
      this.setError(null);
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setIsLoadingMore(false);
    }
  }

  /**
   * 현재 상태를 URL에 동기화
   */
  updateUrl() {
    const params = new URLSearchParams();

    if (this.state.searchQuery) {
      params.set("search", this.state.searchQuery);
    }
    if (this.state.category) {
      const [category1, category2] = this.state.category.split(">").map((c) => c.trim());
      if (category1) params.set("category1", category1);
      if (category2) params.set("category2", category2);
    }
    if (this.state.sort !== DEFAULT_SORT) {
      params.set("sort", this.state.sort);
    }
    // 항상 pageSize를 URL에 포함
    params.set("limit", this.state.pageSize);

    const queryString = params.toString();
    const newUrl = queryString ? `/?${queryString}` : "/";

    window.history.replaceState({}, "", newUrl);
  }

  /**
   * URL에서 검색 조건을 파싱합니다
   * @returns {Object} 파싱된 필터 조건 객체
   */
  parseFiltersFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);

    const filters = {};

    // 검색어
    const search = urlParams.get("search");
    if (search) {
      filters.searchQuery = search;
    }

    // 카테고리
    const category1 = urlParams.get("category1");
    const category2 = urlParams.get("category2");
    if (category1) {
      filters.category = category2 ? `${category1} > ${category2}` : category1;
    }

    // 정렬
    const sort = urlParams.get("sort");
    if (sort) {
      filters.sort = sort;
    }

    // 페이지 크기
    const limit = urlParams.get("limit");
    if (limit && !isNaN(parseInt(limit))) {
      filters.pageSize = parseInt(limit);
    }

    return filters;
  }

  /**
   * URL에서 검색 조건을 읽어와 현재 state와 비교하여 업데이트합니다
   * @returns {boolean} 상태가 변경되었는지 여부
   */
  syncFromUrl() {
    const urlFilters = this.parseFiltersFromUrl();

    // URL에서 파싱된 조건들을 기본값과 비교하여 최종 필터 생성
    const finalFilters = {
      searchQuery: urlFilters.searchQuery || "",
      category: urlFilters.category || "",
      sort: urlFilters.sort || DEFAULT_SORT,
      pageSize: urlFilters.pageSize || DEFAULT_LIMIT,
    };

    // 현재 state와 비교하여 변경된 부분만 확인
    const hasChanged = Object.keys(finalFilters).some((key) => this.state[key] !== finalFilters[key]);

    if (hasChanged) {
      // 변경된 부분만 업데이트 (페이지는 1로 리셋)
      this.setState({
        ...finalFilters,
        currentPage: 1,
      });
      return true;
    }

    return false;
  }

  /**
   * 상태를 초기 상태로 리셋
   * 테스트 환경에서 테스트 간 상태 초기화용으로 사용
   */
  reset() {
    // 구독자들은 유지하고 상태만 초기화
    this.state = {
      products: [],
      totalProducts: 0,
      loading: true,
      error: null,
      searchQuery: "",
      category: "",
      sort: DEFAULT_SORT,
      pageSize: DEFAULT_LIMIT,
      currentPage: 1,
      isLoadingMore: false,
      hasMore: true,
    };
  }
}

export default ProductListManager;
