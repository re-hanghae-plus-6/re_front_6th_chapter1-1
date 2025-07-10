import { Toast } from "../components/Toast.js";

export const CartStorage = (() => {
  const STORAGE_KEY = "SHOPPING_CART";

  /* 장바구니 저장 */
  function save(newItem) {
    try {
      const currentItems = load();
      // 같은 상품이 있는지 확인
      const existingItemIndex = currentItems.findIndex((item) => item.productId === newItem.productId);

      if (existingItemIndex !== -1) {
        // 같은 상품이 있으면 수량 증가
        currentItems[existingItemIndex].quantity = (currentItems[existingItemIndex].quantity || 1) + 1;
      } else {
        // 새로운 상품이면 수량 1로 추가
        newItem.quantity = newItem.quantity || 1;
        currentItems.push(newItem);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentItems));
      Toast.success("장바구니에 추가되었습니다.");
    } catch {
      Toast.error("장바구니 저장에 실패했습니다.");
    }
  }

  /* 장바구니 불러오기 */
  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      Toast.error("장바구니 불러오기에 실패했습니다.");
      return [];
    }
  }

  /* 장바구니 초기화 */
  function clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      Toast.success("장바구니가 모두 삭제되었습니다.");
    } catch {
      Toast.error("장바구니 초기화에 실패했습니다.");
    }
  }

  /* 특정 상품 수량 업데이트 */
  function updateQuantity(productId, newQuantity) {
    try {
      const currentItems = load();
      const itemIndex = currentItems.findIndex((item) => item.productId === productId);

      if (newQuantity === 0) {
        // 수량이 0이면 상품 제거
        currentItems.splice(itemIndex, 1);
      } else {
        // 수량 업데이트
        currentItems[itemIndex].quantity = newQuantity;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentItems));
    } catch {
      Toast.error("수량 업데이트에 실패했습니다.");
    }
  }

  /* 특정 상품 제거 */
  function removeItem(productId) {
    try {
      const currentItems = load();
      const filteredItems = currentItems.filter((item) => item.productId !== productId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredItems));
      Toast.success("상품이 장바구니에서 삭제되었습니다.");
    } catch {
      Toast.error("상품 삭제에 실패했습니다.");
    }
  }

  /* 장바구니 총 개수 반환 */
  function getTotalCount() {
    const items = load();
    return items.reduce((total, item) => total + (item.quantity || 1), 0);
  }

  /* 장바구니 총 금액 반환 */
  function getTotalPrice() {
    const items = load();
    return items.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);
  }

  /* 특정 상품의 수량 반환 */
  function getItemQuantity(productId) {
    const items = load();
    const item = items.find((item) => item.productId === productId);
    return item ? item.quantity || 1 : 0;
  }

  return {
    save, // 장바구니 추가
    load, // 장바구니 불러오기
    clear, // 장바구니 초기화
    updateQuantity, // 장바구니 수량 업데이트
    removeItem, // 장바구니 삭제
    getTotalCount, // 장바구니 총 개수
    getTotalPrice, // 장바구니 총 금액
    getItemQuantity, // 장바구니 특정 상품 수량
  };
})();
