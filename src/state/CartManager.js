import StateManager from "./StateManager.js";

/**
 * CartManager - 장바구니 관련 상태 관리 클래스
 *
 * 장바구니 아이템, 모달 상태 등 장바구니와 관련된 모든 상태와 기능을 관리합니다.
 * StateManager를 상속받아 옵저버 패턴을 활용한 반응형 상태 관리를 제공합니다.
 * 로컬스토리지와 연동하여 새로고침 후에도 장바구니 내용을 유지합니다.
 *
 * 관리하는 상태:
 * - cart: 장바구니 아이템 배열
 * - isCartModalOpen: 장바구니 모달 열림/닫힘 상태
 *
 * @example
 * import stateManager from './state/index.js';
 *
 * // 장바구니 변경 구독
 * stateManager.cart.subscribe('cart', (cartItems) => {
 *   updateCartIcon(cartItems.length);
 *   renderCartItems(cartItems);
 * });
 *
 * // 모달 상태 구독
 * stateManager.cart.subscribe('isCartModalOpen', (isOpen) => {
 *   if (isOpen) showCartModal();
 *   else hideCartModal();
 * });
 *
 * // 상품 추가
 * stateManager.cart.addToCart(product, 2);
 *
 * // 수량 변경
 * stateManager.cart.updateQuantity(productId, 5);
 *
 * // 총 가격 계산
 * const total = stateManager.cart.getTotalPrice();
 */
class CartManager extends StateManager {
  constructor() {
    super();

    /** 장바구니 관련 상태 정의 */
    this.state = {
      /** @type {Array} 장바구니에 담긴 상품들 배열 { id, name, price, quantity, ... } */
      cart: [],

      /** @type {boolean} 장바구니 모달이 열려있는지 여부 */
      isCartModalOpen: false,
    };
  }

  /**
   * 상품을 장바구니에 추가합니다.
   * 이미 존재하는 상품이면 수량을 증가시키고, 새로운 상품이면 추가합니다.
   *
   * @param {Object} product - 추가할 상품 객체
   * @param {string|number} product.id - 상품 ID
   * @param {string} product.name - 상품명
   * @param {number} product.price - 상품 가격
   * @param {number} [quantity=1] - 추가할 수량
   *
   * @example
   * const product = { id: '123', name: '노트북', price: 100000 };
   * stateManager.cart.addToCart(product, 1);
   * stateManager.cart.addToCart(product, 2); // 기존 상품이면 수량 3개가 됨
   */
  addToCart(product, quantity = 1) {
    const cart = [...this.state.cart];
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      // 기존 상품이면 수량만 증가
      existing.quantity += quantity;
    } else {
      // 새로운 상품이면 장바구니에 추가
      cart.push({ ...product, quantity });
    }

    this.setState({ cart });
    this.saveToStorage();
  }

  /**
   * 장바구니에서 특정 상품을 완전히 제거합니다.
   *
   * @param {string|number} productId - 제거할 상품의 ID
   *
   * @example
   * stateManager.cart.removeFromCart('123');
   */
  removeFromCart(productId) {
    const cart = this.state.cart.filter((item) => item.id !== productId);
    this.setState({ cart });
    this.saveToStorage();
  }

  /**
   * 장바구니 상품의 수량을 변경합니다.
   * 수량이 0 이하면 상품을 장바구니에서 제거합니다.
   *
   * @param {string|number} productId - 상품 ID
   * @param {number} quantity - 새로운 수량
   *
   * @example
   * stateManager.cart.updateQuantity('123', 3); // 수량을 3개로 변경
   * stateManager.cart.updateQuantity('123', 0); // 상품 제거
   */
  updateQuantity(productId, quantity) {
    if (quantity <= 0) return this.removeFromCart(productId);

    const cart = this.state.cart.map((item) => (item.id === productId ? { ...item, quantity } : item));
    this.setState({ cart });
    this.saveToStorage();
  }

  /**
   * 장바구니를 완전히 비웁니다.
   *
   * @example
   * stateManager.cart.clearCart();
   */
  clearCart() {
    this.setState({ cart: [] });
    this.saveToStorage();
  }

  /**
   * 장바구니 모달의 열림/닫힘 상태를 토글합니다.
   *
   * @example
   * stateManager.cart.toggleModal();
   */
  toggleModal() {
    this.setState({ isCartModalOpen: !this.state.isCartModalOpen });
  }

  /**
   * 장바구니 모달을 엽니다.
   *
   * @example
   * stateManager.cart.openModal();
   */
  openModal() {
    this.setState({ isCartModalOpen: true });
  }

  /**
   * 장바구니 모달을 닫습니다.
   *
   * @example
   * stateManager.cart.closeModal();
   */
  closeModal() {
    this.setState({ isCartModalOpen: false });
  }

  /**
   * 장바구니에 담긴 모든 상품의 총 가격을 계산합니다.
   *
   * @returns {number} 총 가격
   *
   * @example
   * const total = stateManager.cart.getTotalPrice();
   * console.log(`총 가격: ${total.toLocaleString()}원`);
   */
  getTotalPrice() {
    return this.state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  /**
   * 장바구니에 담긴 모든 상품의 총 수량을 계산합니다.
   *
   * @returns {number} 총 수량
   *
   * @example
   * const totalCount = stateManager.cart.getTotalQuantity();
   * updateCartBadge(totalCount);
   */
  getTotalQuantity() {
    return this.state.cart.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * 현재 장바구니 상태를 로컬스토리지에 저장합니다.
   * 상품 추가/제거/수량 변경 시 자동으로 호출됩니다.
   *
   * @private
   */
  saveToStorage() {
    localStorage.setItem("cart", JSON.stringify(this.state.cart));
  }

  /**
   * 로컬스토리지에서 장바구니 데이터를 불러옵니다.
   * 애플리케이션 초기화 시 호출되어 이전 장바구니 상태를 복원합니다.
   *
   * @example
   * // 애플리케이션 시작 시 자동 호출됨
   * stateManager.cart.loadFromStorage();
   */
  loadFromStorage() {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      this.setState({ cart });
    } catch {
      // 로드에 실패하면 빈 장바구니로 초기화
      this.setState({ cart: [] });
    }
  }
}

export default CartManager;
