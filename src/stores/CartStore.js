// 함수형 CartStore
function createCartStore() {
  // private 상태
  let cartItems = loadCartFromStorage();
  let listeners = [];

  // 로컬스토리지에서 장바구니 데이터 로드
  function loadCartFromStorage() {
    try {
      return JSON.parse(localStorage.getItem("shopping_cart") || "{}");
    } catch {
      return {};
    }
  }

  // 로컬스토리지에 장바구니 데이터 저장
  function saveCartToStorage() {
    localStorage.setItem("shopping_cart", JSON.stringify(cartItems));
  }

  // 구독자 등록
  function subscribe(listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  // 상태 변경 알림
  function notify() {
    listeners.forEach((listener) => listener());
  }

  // 상품을 장바구니에 추가
  function addItem(productId, quantity = 1) {
    if (!productId) return false;

    try {
      if (cartItems[productId]) {
        cartItems[productId] += quantity;
      } else {
        cartItems[productId] = quantity;
      }

      saveCartToStorage();
      notify();
      return true;
    } catch (error) {
      console.error("장바구니 추가 중 오류:", error);
      return false;
    }
  }

  // 상품을 장바구니에서 제거
  function removeItem(productId) {
    if (cartItems[productId]) {
      delete cartItems[productId];
      saveCartToStorage();
      notify();
    }
  }

  // 상품 수량 업데이트
  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      cartItems[productId] = quantity;
      saveCartToStorage();
      notify();
    }
  }

  // 장바구니 비우기
  function clearCart() {
    cartItems = {};
    saveCartToStorage();
    notify();
  }

  // 고유 상품 개수 반환
  function getUniqueProductCount() {
    return Object.keys(cartItems).length;
  }

  // 전체 상품 개수 반환
  function getTotalItemCount() {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  }

  // 장바구니 아이템 반환
  function getCartItems() {
    return { ...cartItems };
  }

  // 공개 API 반환
  return {
    subscribe,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getUniqueProductCount,
    getTotalItemCount,
    getCartItems,
  };
}

export const cartStore = createCartStore();
