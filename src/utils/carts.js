// 장바구니 관련 로컬스토리지 유틸리티 함수들

const CART_STORAGE_KEY = "shopping_cart";

// 장바구니 데이터 가져오기
export const getCartItems = () => {
  const cartData = localStorage.getItem(CART_STORAGE_KEY);

  return cartData ? JSON.parse(cartData) : [];
};

export const updateCartItems = (cartItems) => {
  const dataString = JSON.stringify(cartItems);

  localStorage.setItem(CART_STORAGE_KEY, dataString);
};

// 장바구니에 상품 추가
export const addToCart = (product, quantity) => {
  const cartItems = getCartItems();
  const existingItemIndex = cartItems.findIndex((item) => item.productId === product.productId);

  if (existingItemIndex !== -1) {
    // 이미 장바구니에 있는 상품이면 수량 증가
    cartItems[existingItemIndex].quantity += product.quantity || 1;
  } else {
    // 새로운 상품이면 추가
    cartItems.push({ ...product, quantity: quantity || 1, isSelected: false });
  }

  updateCartItems(cartItems);
};

// 장바구니에서 상품 제거
export const removeCartItem = (productId) => {
  try {
    const cartItems = getCartItems();
    const updatedItems = cartItems.filter((item) => item.productId !== productId);

    updateCartItems(updatedItems);

    return updatedItems;
  } catch (error) {
    console.error("장바구니에서 상품을 제거하는 중 오류가 발생했습니다:", error);
    return getCartItems();
  }
};

export const removeSelectedCartItems = () => {
  const cartItems = getCartItems();
  const updatedItems = cartItems.filter((item) => !item.isSelected);

  updateCartItems(updatedItems);

  return updatedItems;
};

// 장바구니 수량 변경
export const updateCartQuantity = (productId, type) => {
  try {
    const cartItems = getCartItems();
    const productIndex = cartItems.findIndex((item) => item.productId === productId);

    if (productIndex === -1) {
      console.error("상품을 찾을 수 없습니다:", productId);
      return getCartItems();
    }

    if (type === "decrease") {
      // 수량이 1보다 클 때만 감소
      if (cartItems[productIndex].quantity > 1) {
        cartItems[productIndex].quantity -= 1;
      }
    } else {
      cartItems[productIndex].quantity += 1;
    }

    // 로컬스토리지에 저장
    updateCartItems(cartItems);

    return cartItems;
  } catch (error) {
    console.error("장바구니 수량을 변경하는 중 오류가 발생했습니다:", error);
    return getCartItems();
  }
};

// 장바구니 비우기
export const clearCart = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  } catch (error) {
    console.error("장바구니를 비우는 중 오류가 발생했습니다:", error);
    return [];
  }
};

// 장바구니 총 상품 개수
export const getCartItemCount = () => {
  const cartItems = getCartItems();

  return cartItems.length;
};

// 장바구니 선택 상태 업데이트
export const updateCartItemSelection = (productId, isSelected) => {
  try {
    const cartItems = getCartItems();
    const itemIndex = cartItems.findIndex((item) => item.productId === productId);

    if (itemIndex !== -1) {
      cartItems[itemIndex].isSelected = isSelected;
    }

    updateCartItems(cartItems);

    return cartItems;
  } catch (error) {
    console.error("장바구니 선택 상태를 업데이트하는 중 오류가 발생했습니다:", error);
    return getCartItems();
  }
};

// 장바구니 전체 선택/해제
export const toggleSelectAll = (isSelected) => {
  try {
    const cartItems = getCartItems();
    const updatedItems = cartItems.map((item) => ({
      ...item,
      isSelected: isSelected,
    }));

    updateCartItems(updatedItems);

    return updatedItems;
  } catch (error) {
    console.error("장바구니 전체 선택을 업데이트하는 중 오류가 발생했습니다:", error);
    return getCartItems();
  }
};

// 장바구니 총 금액
export const getCartTotal = () => {
  const cartItems = getCartItems();
  return cartItems.reduce((total, item) => total + item.lprice * item.quantity, 0);
};
