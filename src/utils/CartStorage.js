import { Toast } from "../components/Toast.js";

const CartStorage = (() => {
  const STORAGE_KEY = "shopping_cart";

  /* 장바구니 저장 */
  function save(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      Toast.success("장바구니에 추가되었습니다.");
    } catch {
      Toast.error("장바구니 저장 실패");
    }
  }

  /* 장바구니 불러오기 */
  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      Toast.error("장바구니 불러오기 실패");
      return [];
    }
  }

  /* 장바구니 초기화 */
  function clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      Toast.success("장바구니가 모두 삭제되었습니다.");
    } catch {
      Toast.error("장바구니 초기화 실패");
    }
  }

  return { save, load, clear };
})();

export default CartStorage;
