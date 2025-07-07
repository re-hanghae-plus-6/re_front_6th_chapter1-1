import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";
import UIManager from "./UIManager.js";

/**
 * AppStateManager - 전체 애플리케이션의 상태 관리 통합 클래스
 *
 * 각 도메인별 매니저(ProductManager, CartManager, UIManager)를 통합하여 관리하고,
 * 도메인 간 상호작용이 필요한 고차원 메서드들을 제공합니다.
 *
 * 구조:
 * - product: ProductManager 인스턴스 (상품 관련 상태)
 * - cart: CartManager 인스턴스 (장바구니 관련 상태)
 * - ui: UIManager 인스턴스 (UI 관련 상태)
 *
 * 주요 기능:
 * - 각 도메인 매니저의 통합 관리
 * - 도메인 간 상호작용 헬퍼 메서드 제공
 * - 애플리케이션 초기화 및 설정
 */
class AppStateManager {
  constructor() {
    /** @type {ProductManager} 상품 관련 상태 관리자 */
    this.product = new ProductManager();

    /** @type {CartManager} 장바구니 관련 상태 관리자 */
    this.cart = new CartManager();

    /** @type {UIManager} UI 관련 상태 관리자 */
    this.ui = new UIManager();
  }

  /**
   * 애플리케이션을 초기화합니다.
   * 로컬스토리지에서 저장된 데이터를 복원하고 필요한 초기 설정을 수행합니다.
   *
   * @example
   * // 애플리케이션 시작 시 자동으로 호출됨
   * stateManager.initialize();
   */
  initialize() {
    this.cart.loadFromStorage();
  }

  /**
   * 상품을 장바구니에 추가하고 성공 토스트를 표시하는 통합 메서드입니다.
   * 단순히 장바구니에 추가하는 것뿐만 아니라 사용자에게 피드백도 제공합니다.
   *
   * @param {Object} product - 추가할 상품 객체
   * @param {string|number} product.id - 상품 ID
   * @param {string} product.name - 상품명
   * @param {number} product.price - 상품 가격
   * @param {number} [quantity=1] - 추가할 수량
   *
   * @example
   * const product = { id: '123', name: '노트북', price: 100000 };
   *
   * // 1개 추가
   * stateManager.addProductToCart(product);
   *
   * // 3개 추가
   * stateManager.addProductToCart(product, 3);
   */
  addProductToCart(product, quantity = 1) {
    this.cart.addToCart(product, quantity);
    this.ui.showToast(`${product.name}이(가) 장바구니에 추가되었습니다.`, "success");
  }

  /**
   * 상품 목록을 로드하고 로딩 상태를 완료로 설정하는 통합 메서드입니다.
   * API 호출 성공 시 사용되며, 상품 데이터 설정과 로딩 상태 관리를 함께 처리합니다.
   *
   * @param {Array} products - 상품 배열
   * @param {number} totalProducts - 전체 상품 수
   *
   * @example
   * // API 호출 성공 시
   * try {
   *   const response = await fetchProducts();
   *   stateManager.loadProducts(response.products, response.total);
   * } catch (error) {
   *   stateManager.loadProductsError(error.message);
   * }
   */
  loadProducts(products, totalProducts) {
    this.product.setProducts(products, totalProducts);
    this.product.setLoading(false);
  }

  /**
   * 상품 로딩 실패 시 에러 상태를 설정하고 에러 토스트를 표시하는 통합 메서드입니다.
   *
   * @param {string} error - 에러 메시지
   *
   * @example
   * // API 호출 실패 시
   * try {
   *   const products = await fetchProducts();
   *   stateManager.loadProducts(products);
   * } catch (error) {
   *   stateManager.loadProductsError('상품을 불러올 수 없습니다.');
   * }
   */
  loadProductsError(error) {
    this.product.setError(error);
    this.ui.showToast("상품을 불러오는데 실패했습니다.", "error");
  }
}

/**
 * 싱글톤 AppStateManager 인스턴스
 *
 * 애플리케이션 전체에서 하나의 상태 관리자만 사용하도록 보장합니다.
 * 이 인스턴스는 자동으로 초기화되며, 모든 컴포넌트에서 import하여 사용할 수 있습니다.
 *
 * @type {AppStateManager}
 */
const stateManager = new AppStateManager();

// 애플리케이션 시작 시 자동 초기화
stateManager.initialize();

export default stateManager;

/**
 * StateManager 사용 가이드
 *
 * 이 파일에서 export되는 stateManager는 전체 애플리케이션의 상태를 관리하는
 * 싱글톤 인스턴스입니다. 다음과 같이 사용할 수 있습니다:
 *
 * @example
 * import stateManager from './state/index.js';
 *
 * // ===== 1. 상태 구독 (StateManager 베이스 클래스 기능) =====
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
 * // 장바구니 변경 구독
 * stateManager.cart.subscribe('cart', (cartItems) => {
 *   updateCartIcon(cartItems.length);
 *   renderCartItems(cartItems);
 * });
 *
 * // 토스트 메시지 구독
 * stateManager.ui.subscribe('toast', (toast) => {
 *   if (toast) showToastMessage(toast.message, toast.type);
 *   else hideToastMessage();
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
 * // ===== 2. 개별 상태 변경 (각 도메인 매니저 기능) =====
 *
 * // 상품 관련
 * stateManager.product.setLoading(true);
 * stateManager.product.setProducts([...products], 100);
 * stateManager.product.setError('오류 메시지');
 * stateManager.product.setFilters({ searchQuery: '노트북', category: 'electronics' });
 *
 * // 장바구니 관련
 * stateManager.cart.addToCart(product, 2);
 * stateManager.cart.updateQuantity(productId, 5);
 * stateManager.cart.removeFromCart(productId);
 * stateManager.cart.clearCart();
 * stateManager.cart.openModal();
 *
 * // UI 관련
 * stateManager.ui.showToast('성공!', 'success');
 * stateManager.ui.showToast('오류!', 'error', 5000);
 * stateManager.ui.hideToast();
 *
 * // ===== 3. 통합 헬퍼 메서드 (AppStateManager 기능) =====
 *
 * // 상품을 장바구니에 추가하면서 토스트도 표시
 * stateManager.addProductToCart(product, 1);
 *
 * // 상품 로딩 성공 처리
 * stateManager.loadProducts(products, totalCount);
 *
 * // 상품 로딩 실패 처리
 * stateManager.loadProductsError('네트워크 오류');
 *
 * // ===== 4. 상태 조회 =====
 *
 * // 특정 상태 조회
 * const isLoading = stateManager.product.getState('loading');
 * const cartItems = stateManager.cart.getState('cart');
 * const currentToast = stateManager.ui.getState('toast');
 *
 * // 도메인별 전체 상태 조회
 * const productState = stateManager.product.getState();
 * const cartState = stateManager.cart.getState();
 * const uiState = stateManager.ui.getState();
 *
 * // ===== 5. 계산 메서드 활용 =====
 *
 * // 장바구니 총 가격 계산
 * const totalPrice = stateManager.cart.getTotalPrice();
 *
 * // 장바구니 총 수량 계산
 * const totalQuantity = stateManager.cart.getTotalQuantity();
 */
