import cartStore from "./cart-store";

/**
 * 장바구니 액션 함수들
 * 컴포넌트에서 장바구니 조작을 위한 헬퍼 함수들
 */

/**
 * 장바구니에 상품 추가
 * @param {Object} product - 추가할 상품 정보
 * @param {string} product.id - 상품 ID
 * @param {string} product.title - 상품 제목
 * @param {number} product.lprice - 상품 가격
 * @param {string} product.image - 상품 이미지
 * @returns {boolean} 성공 여부
 */
export const addToCart = (product) => {
  try {
    if (!product || !product.id) {
      console.error("상품 정보가 올바르지 않습니다.", product);
      return false;
    }

    cartStore.addItem(product);
    return true;
  } catch (error) {
    console.error("장바구니 추가 중 오류:", error);
    return false;
  }
};

export const bulkAddToCart = (product, quantity) => {
  try {
    if (!product || !product.id) {
      console.error("상품 정보가 올바르지 않습니다.", product);
      return false;
    }

    cartStore.bulkAddItem(product, quantity);
    return true;
  } catch (error) {
    console.error("장바구니 추가 중 오류:", error);
    return false;
  }
};

/**
 * 장바구니에서 상품 제거
 * @param {string} productId - 제거할 상품 ID
 * @returns {boolean} 성공 여부
 */
export const removeFromCart = (productId) => {
  try {
    if (!productId) {
      console.error("상품 ID가 제공되지 않았습니다.");
      return false;
    }

    cartStore.removeItem(productId);
    console.log("상품이 장바구니에서 제거되었습니다.");
    return true;
  } catch (error) {
    console.error("장바구니 제거 중 오류:", error);
    return false;
  }
};

/**
 * 장바구니 상품 수량 업데이트
 * @param {string} productId - 상품 ID
 * @param {number} quantity - 새로운 수량
 * @returns {boolean} 성공 여부
 */
export const updateCartItemQuantity = (productId, quantity) => {
  try {
    if (!productId || quantity < 0) {
      console.error("잘못된 파라미터:", { productId, quantity });
      return false;
    }

    cartStore.updateItemQuantity(productId, quantity);
    return true;
  } catch (error) {
    console.error("수량 업데이트 중 오류:", error);
    return false;
  }
};

/**
 * 장바구니 상품 수량 증가
 * @param {string} productId - 상품 ID
 * @returns {boolean} 성공 여부
 */
export const increaseCartItemQuantity = (productId) => {
  try {
    if (!productId) {
      console.error("상품 ID가 제공되지 않았습니다.");
      return false;
    }

    cartStore.increaseItemQuantity(productId);
    return true;
  } catch (error) {
    console.error("수량 증가 중 오류:", error);
    return false;
  }
};

/**
 * 장바구니 상품 수량 감소
 * @param {string} productId - 상품 ID
 * @returns {boolean} 성공 여부
 */
export const decreaseCartItemQuantity = (productId) => {
  try {
    if (!productId) {
      console.error("상품 ID가 제공되지 않았습니다.");
      return false;
    }

    cartStore.decreaseItemQuantity(productId);
    return true;
  } catch (error) {
    console.error("수량 감소 중 오류:", error);
    return false;
  }
};

/**
 * 장바구니 비우기
 * @returns {boolean} 성공 여부
 */
export const clearCart = () => {
  try {
    cartStore.clearCart();
    console.log("장바구니가 비워졌습니다.");
    return true;
  } catch (error) {
    console.error("장바구니 비우기 중 오류:", error);
    return false;
  }
};

/**
 * 선택 관련 액션 함수들
 */

/**
 * 전체 선택/해제
 * @param {boolean} isSelected - 선택 여부
 * @returns {boolean} 성공 여부
 */
export const selectAllCartItems = (isSelected) => {
  try {
    cartStore.selectAll(isSelected);
    console.log(isSelected ? "전체 선택됨" : "전체 선택 해제됨");
    return true;
  } catch (error) {
    console.error("전체 선택 중 오류:", error);
    return false;
  }
};

/**
 * 개별 아이템 선택/해제
 * @param {string} productId - 상품 ID
 * @param {boolean} isSelected - 선택 여부
 * @returns {boolean} 성공 여부
 */
export const selectCartItem = (productId, isSelected) => {
  try {
    if (!productId) {
      console.error("상품 ID가 제공되지 않았습니다.");
      return false;
    }

    cartStore.selectItem(productId, isSelected);
    return true;
  } catch (error) {
    console.error("아이템 선택 중 오류:", error);
    return false;
  }
};

/**
 * 선택된 아이템들 삭제
 * @returns {boolean} 성공 여부
 */
export const removeSelectedCartItems = () => {
  try {
    const selectedCount = cartStore.getSelectedItems().length;
    if (selectedCount === 0) {
      console.warn("선택된 아이템이 없습니다.");
      return false;
    }

    cartStore.removeSelectedItems();
    console.log(`선택된 ${selectedCount}개 아이템이 삭제되었습니다.`);
    return true;
  } catch (error) {
    console.error("선택된 아이템 삭제 중 오류:", error);
    return false;
  }
};

/**
 * 장바구니 모달 토글
 * @returns {boolean} 현재 표시 상태
 */
export const toggleCartModal = () => {
  try {
    cartStore.toggleVisibility();
    return cartStore.getIsVisible();
  } catch (error) {
    console.error("장바구니 모달 토글 중 오류:", error);
    return false;
  }
};

/**
 * 장바구니 모달 표시
 */
export const showCartModal = () => {
  try {
    cartStore.showCart();
  } catch (error) {
    console.error("장바구니 모달 표시 중 오류:", error);
  }
};

/**
 * 장바구니 모달 숨김
 */
export const hideCartModal = () => {
  try {
    cartStore.hideCart();
  } catch (error) {
    console.error("장바구니 모달 숨김 중 오류:", error);
  }
};

/**
 * 장바구니 상태 조회 함수들
 */

/**
 * 장바구니 아이템 목록 조회
 * @returns {Array} 장바구니 아이템 배열
 */
export const getCartItems = () => {
  return cartStore.getItems();
};

/**
 * 장바구니 아이템 개수 조회
 * @returns {number} 아이템 개수
 */
export const getCartCount = () => {
  return cartStore.getCount();
};

/**
 * 장바구니 총 가격 조회
 * @returns {number} 총 가격
 */
export const getCartTotalPrice = () => {
  return cartStore.getTotalPrice();
};

/**
 * 장바구니 요약 정보 조회
 * @returns {Object} 장바구니 요약 정보
 */
export const getCartSummary = () => {
  return cartStore.getSummary();
};

/**
 * 특정 상품이 장바구니에 있는지 확인
 * @param {string} productId - 상품 ID
 * @returns {boolean} 장바구니에 있는지 여부
 */
export const hasCartItem = (productId) => {
  return cartStore.hasItem(productId);
};

/**
 * 특정 상품의 장바구니 수량 조회
 * @param {string} productId - 상품 ID
 * @returns {number} 상품 수량
 */
export const getCartItemQuantity = (productId) => {
  return cartStore.getItemQuantity(productId);
};

/**
 * 선택 관련 조회 함수들
 */

/**
 * 선택된 아이템 ID 목록 조회
 * @returns {Array} 선택된 아이템 ID 배열
 */
export const getSelectedCartItems = () => {
  return cartStore.getSelectedItems();
};

/**
 * 전체 선택 여부 조회
 * @returns {boolean} 전체 선택 여부
 */
export const isAllCartItemsSelected = () => {
  return cartStore.getIsAllSelected();
};

/**
 * 특정 상품의 선택 여부 조회
 * @param {string} productId - 상품 ID
 * @returns {boolean} 선택 여부
 */
export const isCartItemSelected = (productId) => {
  return cartStore.isItemSelected(productId);
};

/**
 * 선택된 아이템들의 총 가격 조회
 * @returns {number} 선택된 아이템들의 총 가격
 */
export const getSelectedCartItemsTotal = () => {
  return cartStore.getSelectedItemsTotal();
};

/**
 * 장바구니 상태 구독 함수들
 */

/**
 * 장바구니 아이템 변경 구독
 * @param {Function} callback - 콜백 함수
 * @returns {Function} 구독 해제 함수
 */
export const subscribeToCartItems = (callback) => {
  return cartStore.subscribe("items", callback);
};

/**
 * 장바구니 개수 변경 구독
 * @param {Function} callback - 콜백 함수
 * @returns {Function} 구독 해제 함수
 */
export const subscribeToCartCount = (callback) => {
  return cartStore.subscribe("count", callback);
};

/**
 * 장바구니 총 가격 변경 구독
 * @param {Function} callback - 콜백 함수
 * @returns {Function} 구독 해제 함수
 */
export const subscribeToCartTotalPrice = (callback) => {
  return cartStore.subscribe("totalPrice", callback);
};

/**
 * 장바구니 모달 표시 상태 구독
 * @param {Function} callback - 콜백 함수
 * @returns {Function} 구독 해제 함수
 */
export const subscribeToCartVisibility = (callback) => {
  return cartStore.subscribe("isVisible", callback);
};

/**
 * 장바구니 전체 상태 구독
 * @param {Function} callback - 콜백 함수
 * @returns {Function} 구독 해제 함수
 */
export const subscribeToCart = (callback) => {
  return cartStore.subscribeGlobal(callback);
};

/**
 * 선택 상태 구독
 * @param {Function} callback - 콜백 함수
 * @returns {Function} 구독 해제 함수
 */
export const subscribeToCartSelection = (callback) => {
  return cartStore.subscribe("selectedItems", callback);
};

/**
 * 전체 선택 상태 구독
 * @param {Function} callback - 콜백 함수
 * @returns {Function} 구독 해제 함수
 */
export const subscribeToCartSelectAll = (callback) => {
  return cartStore.subscribe("isAllSelected", callback);
};

/**
 * 개발용 유틸리티 함수들
 */

/**
 * 장바구니 디버그 정보 출력
 */
export const debugCart = () => {
  if (process.env.NODE_ENV === "development") {
    console.log("=== 장바구니 디버그 정보 ===");
    console.log("아이템:", cartStore.getItems());
    console.log("개수:", cartStore.getCount());
    console.log("총 가격:", cartStore.getTotalPrice());
    console.log("드롭다운 표시:", cartStore.getIsVisible());
    console.log("요약:", cartStore.getSummary());
    console.log("=======================");

    cartStore.debug();
  }
};

/**
 * 테스트용 더미 데이터 추가
 */
export const addDummyCartItems = () => {
  if (process.env.NODE_ENV === "development") {
    const dummyProducts = [
      {
        id: "test-1",
        title: "테스트 상품 1",
        lprice: 10000,
        image: "https://via.placeholder.com/150",
      },
      {
        id: "test-2",
        title: "테스트 상품 2",
        lprice: 20000,
        image: "https://via.placeholder.com/150",
      },
    ];

    dummyProducts.forEach((product) => addToCart(product));
    console.log("더미 장바구니 아이템이 추가되었습니다.");
  }
};

export default {
  // 액션 함수들
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  increaseCartItemQuantity,
  decreaseCartItemQuantity,
  clearCart,

  // 선택 관련 액션들
  selectAllCartItems,
  selectCartItem,
  removeSelectedCartItems,

  toggleCartModal,
  showCartModal,
  hideCartModal,

  // 조회 함수들
  getCartItems,
  getCartCount,
  getCartTotalPrice,
  getCartSummary,
  hasCartItem,
  getCartItemQuantity,

  // 선택 관련 조회들
  getSelectedCartItems,
  isAllCartItemsSelected,
  isCartItemSelected,
  getSelectedCartItemsTotal,

  // 구독 함수들
  subscribeToCartItems,
  subscribeToCartCount,
  subscribeToCartTotalPrice,
  subscribeToCartVisibility,
  subscribeToCart,
  subscribeToCartSelection,
  subscribeToCartSelectAll,

  // 개발용 함수들
  debugCart,
  addDummyCartItems,
};
