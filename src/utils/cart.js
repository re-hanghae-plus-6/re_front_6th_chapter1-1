// 장바구니 관련 유틸리티 함수들

/**
 * 장바구니 데이터를 가져옵니다
 * @returns {Array} 장바구니 상품 목록
 */
export const getCart = () => {
  return JSON.parse(sessionStorage.getItem("cart")) || [];
};

/**
 * 장바구니 데이터를 저장합니다
 * @param {Array} cart - 장바구니 상품 목록
 */
export const saveCart = (cart) => {
  sessionStorage.setItem("cart", JSON.stringify(cart));
};

/**
 * 장바구니에 상품을 추가합니다
 * @param {Object} product - 추가할 상품
 * @returns {Array} 업데이트된 장바구니
 */
export const addToCart = (product) => {
  const cart = getCart();
  const existingProductIndex = cart.findIndex((item) => item.productId === product.productId);

  if (existingProductIndex !== -1) {
    // 이미 있는 상품의 수량 증가
    cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1;
  } else {
    // 새로운 상품 추가 (기본 수량 1)
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart(cart);
  return cart;
};

/**
 * 장바구니에서 상품을 제거합니다
 * @param {string} productId - 제거할 상품 ID
 * @returns {Array} 업데이트된 장바구니
 */
export const removeFromCart = (productId) => {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.productId !== productId);
  saveCart(updatedCart);
  return updatedCart;
};

/**
 * 장바구니 상품의 수량을 업데이트합니다
 * @param {string} productId - 상품 ID
 * @param {number} quantity - 새로운 수량
 * @returns {Array} 업데이트된 장바구니
 */
export const updateCartQuantity = (productId, quantity) => {
  const cart = getCart();
  const productIndex = cart.findIndex((item) => item.productId === productId);

  if (productIndex !== -1) {
    if (quantity <= 0) {
      // 수량이 0 이하면 상품 제거
      cart.splice(productIndex, 1);
    } else {
      // 수량 업데이트
      cart[productIndex].quantity = quantity;
    }
  }

  saveCart(cart);
  return cart;
};

/**
 * 장바구니를 비웁니다
 */
export const clearCart = () => {
  sessionStorage.removeItem("cart");
};

/**
 * 장바구니의 총 상품 개수를 반환합니다
 * @returns {number} 총 상품 개수
 */
export const getCartItemCount = () => {
  const cart = getCart();

  return cart.length;
};

/**
 * 장바구니의 총 금액을 계산합니다
 * @returns {number} 총 금액
 */
export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => {
    const price = parseInt(item.lprice) || 0;
    const quantity = item.quantity || 1;
    return total + price * quantity;
  }, 0);
};
