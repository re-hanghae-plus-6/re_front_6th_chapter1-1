const CART_STORAGE_KEY = "shopping_cart";

export const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error("로컬 스토리지 장바구니 저장 실패", error);
  }
};

export const getCartFromStorage = () => {
  try {
    const cartInStorage = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartInStorage) return [];
    return JSON.parse(cartInStorage);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const clearCartStorage = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error(error);
  }
};
