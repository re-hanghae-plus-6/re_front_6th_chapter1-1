const CART_STORAGE_KEY = "shopping_cart";
const SELECTED_ITEMS_STORAGE_KEY = "shopping_cart_selected";

// localStorage에 장바구니 데이터 저장
export function saveCartToStorage(cart, selectedCartItems) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    localStorage.setItem(SELECTED_ITEMS_STORAGE_KEY, JSON.stringify(selectedCartItems));
  } catch (error) {
    console.warn("Failed to save cart to localStorage:", error);
  }
}

// localStorage에서 장바구니 데이터 로드
export function loadCartFromStorage() {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    const selectedItemsData = localStorage.getItem(SELECTED_ITEMS_STORAGE_KEY);

    return {
      cart: cartData ? JSON.parse(cartData) : [],
      selectedCartItems: selectedItemsData ? JSON.parse(selectedItemsData) : [],
    };
  } catch (error) {
    console.warn("Failed to load cart from localStorage:", error);
    return {
      cart: [],
      selectedCartItems: [],
    };
  }
}

// localStorage에서 장바구니 데이터 삭제
export function clearCartFromStorage() {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(SELECTED_ITEMS_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear cart from localStorage:", error);
  }
}
