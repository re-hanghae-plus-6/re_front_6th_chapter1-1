import StateManager from "./StateManager.js";

/**
 * ProductManager - 상품 관련 상태 관리 클래스
 *
 * 상품 목록, 검색, 필터링, 로딩 상태 등 상품과 관련된 모든 상태를 관리합니다.
 * StateManager를 상속받아 옵저버 패턴을 활용한 반응형 상태 관리를 제공합니다.
 *
 * 관리하는 상태:
 * - products: 상품 목록 배열
 * - totalProducts: 전체 상품 수
 * - loading: 로딩 상태
 * - error: 에러 정보
 * - searchQuery: 검색어
 * - category: 선택된 카테고리
 * - sort: 정렬 조건
 * - pageSize: 페이지당 상품 수
 *
 * @example
 * import stateManager from './state/index.js';
 *
 * // 상품 로딩 상태 구독
 * stateManager.product.subscribe('loading', (isLoading) => {
 *   if (isLoading) showLoadingSpinner();
 *   else hideLoadingSpinner();
 * });
 *
 * // 상품 목록 구독
 * stateManager.product.subscribe('products', (products) => {
 *   renderProductList(products);
 * });
 *
 * // 여러 상태 동시 구독
 * stateManager.product.subscribe(['products', 'loading', 'error'], (value, key) => {
 *   switch(key) {
 *     case 'products': renderProducts(value); break;
 *     case 'loading': toggleLoading(value); break;
 *     case 'error': showError(value); break;
 *   }
 * });
 *
 * // 상태 변경
 * stateManager.product.setLoading(true);
 * stateManager.product.setProducts([...products], 100);
 * stateManager.product.setFilters({ searchQuery: '검색어', category: 'electronics' });
 */
class ProductManager extends StateManager {
  constructor() {
    super();

    /** 상품 관련 상태 정의 */
    this.state = {
      /** @type {Array} 현재 로드된 상품 목록 */
      products: [],

      /** @type {number} 전체 상품 수 (페이징을 위한 정보) */
      totalProducts: 0,

      /** @type {boolean} 상품 로딩 중인지 여부 */
      loading: false,

      /** @type {string|null} 에러 메시지 (에러가 없으면 null) */
      error: null,

      /** @type {string} 현재 검색어 */
      searchQuery: "",

      /** @type {string} 현재 선택된 카테고리 */
      category: "",

      /** @type {string} 정렬 조건 ('latest', 'price_asc', 'price_desc', 'popular' 등) */
      sort: "latest",

      /** @type {number} 페이지당 표시할 상품 수 */
      pageSize: 20,
    };
  }

  /**
   * 로딩 상태를 설정합니다.
   * @param {boolean} loading - 로딩 상태
   *
   * @example
   * stateManager.product.setLoading(true);  // 로딩 시작
   * stateManager.product.setLoading(false); // 로딩 완료
   */
  setLoading(loading) {
    this.setState({ loading });
  }

  /**
   * 상품 목록과 전체 상품 수를 설정합니다.
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
    this.setState({ products, ...(totalProducts && { totalProducts }) });
  }

  /**
   * 에러 상태를 설정하고 로딩을 중지합니다.
   * @param {string|null} error - 에러 메시지
   *
   * @example
   * stateManager.product.setError('상품을 불러오는데 실패했습니다.');
   * stateManager.product.setError(null); // 에러 제거
   */
  setError(error) {
    this.setState({ error, loading: false });
  }

  /**
   * 검색/필터 조건들을 한번에 설정합니다.
   * @param {Object} filters - 필터 객체
   * @param {string} [filters.searchQuery] - 검색어
   * @param {string} [filters.category] - 카테고리
   * @param {string} [filters.sort] - 정렬 조건
   * @param {number} [filters.pageSize] - 페이지 크기
   *
   * @example
   * // 검색어만 변경
   * stateManager.product.setFilters({ searchQuery: '노트북' });
   *
   * // 여러 필터 동시 변경
   * stateManager.product.setFilters({
   *   searchQuery: '스마트폰',
   *   category: 'electronics',
   *   sort: 'price_asc',
   *   pageSize: 50
   * });
   */
  setFilters(filters) {
    this.setState(filters);
  }
}

export default ProductManager;
