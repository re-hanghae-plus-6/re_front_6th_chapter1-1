/**
 * 장바구니 서비스 클래스
 */
class CartService {
  constructor() {
    this.state = {
      items: [],
      isModalOpen: false,
      loading: false,
      error: null,
    };
    this.listeners = [];
  }

  /**
   * 상태 변경 리스너 추가
   */
  addListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * 상태 변경 리스너 제거
   */
  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  /**
   * 모든 리스너에게 상태 변경 알림
   */
  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  /**
   * 현재 상태 반환
   */
  getState() {
    return { ...this.state };
  }

  /**
   * 로컬 스토리지에서 장바구니 데이터 로드
   */
  loadCartFromStorage() {
    try {
      const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
      this.state.items = cartData.map((item) => ({
        ...item,
        selected: item.selected !== false, // 기본값 true
      }));
      this.notifyListeners();
    } catch (error) {
      console.error("장바구니 로드 실패:", error);
      this.state.items = [];
      this.notifyListeners();
    }
  }

  /**
   * 장바구니 데이터를 로컬 스토리지에 저장
   */
  saveCartToStorage() {
    try {
      localStorage.setItem("cart", JSON.stringify(this.state.items));
    } catch (error) {
      console.error("장바구니 저장 실패:", error);
    }
  }

  /**
   * 상품을 장바구니에 추가
   */
  addToCart(product, quantity = 1) {
    const existingItemIndex = this.state.items.findIndex((item) => item.productId === product.productId);

    if (existingItemIndex >= 0) {
      // 기존 상품의 수량 증가
      this.state.items[existingItemIndex].quantity += quantity;
    } else {
      // 새 상품 추가
      this.state.items.push({
        ...product,
        quantity,
        selected: true,
      });
    }

    this.saveCartToStorage();
    this.notifyListeners();
  }

  /**
   * 장바구니에서 상품 제거
   */
  removeFromCart(productId) {
    this.state.items = this.state.items.filter((item) => item.productId !== productId);
    this.saveCartToStorage();
    this.notifyListeners();
  }

  /**
   * 선택된 상품들 삭제
   */
  removeSelectedItems() {
    this.state.items = this.state.items.filter((item) => !item.selected);
    this.saveCartToStorage();
    this.notifyListeners();
  }

  /**
   * 장바구니 전체 비우기
   */
  clearCart() {
    this.state.items = [];
    this.saveCartToStorage();
    this.notifyListeners();
  }

  /**
   * 상품 수량 업데이트
   */
  updateQuantity(productId, quantity) {
    const item = this.state.items.find((item) => item.productId === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCartToStorage();
      this.notifyListeners();
    }
  }

  /**
   * 상품 선택 상태 토글
   */
  toggleItemSelection(productId) {
    const item = this.state.items.find((item) => item.productId === productId);
    if (item) {
      item.selected = !item.selected;
      this.saveCartToStorage();
      this.notifyListeners();
    }
  }

  /**
   * 전체 선택/해제
   */
  toggleSelectAll() {
    const allSelected = this.state.items.every((item) => item.selected);
    this.state.items.forEach((item) => {
      item.selected = !allSelected;
    });
    this.saveCartToStorage();
    this.notifyListeners();
  }

  /**
   * 장바구니 모달 열기
   */
  openModal() {
    this.state.isModalOpen = true;
    this.notifyListeners();
  }

  /**
   * 장바구니 모달 닫기
   */
  closeModal() {
    this.state.isModalOpen = false;
    this.notifyListeners();
  }

  /**
   * 선택된 상품들의 총 금액 계산
   */
  getSelectedTotal() {
    return this.state.items
      .filter((item) => item.selected)
      .reduce((total, item) => total + parseInt(item.lprice) * item.quantity, 0);
  }

  /**
   * 전체 상품들의 총 금액 계산
   */
  getTotal() {
    return this.state.items.reduce((total, item) => total + parseInt(item.lprice) * item.quantity, 0);
  }

  /**
   * 선택된 상품 개수
   */
  getSelectedCount() {
    return this.state.items.filter((item) => item.selected).length;
  }

  /**
   * 장바구니 아이템 개수
   */
  getItemCount() {
    return this.state.items.length;
  }

  /**
   * 상태 초기화
   */
  reset() {
    this.state = {
      items: [],
      isModalOpen: false,
      loading: false,
      error: null,
    };
    this.saveCartToStorage();
    this.notifyListeners();
  }
}

export const cartService = new CartService();
