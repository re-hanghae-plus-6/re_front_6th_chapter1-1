// Observer 패턴을 사용한 장바구니 상태 관리
class CartStore {
  constructor() {
    this.state = {
      items: [],
      totalCount: 0,
      totalPrice: 0,
    };
    this.subscribers = [];
  }

  // 구독자 등록
  subscribe(callback) {
    this.subscribers.push(callback);
    // 초기 상태를 즉시 전달
    callback(this.state);
    // 구독 취소 함수 반환
    return () => {
      this.subscribers = this.subscribers.filter((subscriber) => subscriber !== callback);
    };
  }

  // 상태 변경 알림
  notify() {
    this.subscribers.forEach((callback) => callback(this.state));
  }

  // 장바구니에 아이템 추가
  addItem(item) {
    const existingItemIndex = this.state.items.findIndex((existingItem) => existingItem.productId === item.productId);

    if (existingItemIndex >= 0) {
      // 이미 존재하는 상품의 수량 증가
      this.state.items[existingItemIndex].quantity += item.quantity;
    } else {
      // 새로운 상품 추가
      this.state.items.push({ ...item });
    }

    this.updateTotals();
    this.notify();
  }

  // 장바구니에서 아이템 제거
  removeItem(productId) {
    this.state.items = this.state.items.filter((item) => item.productId !== productId);
    this.updateTotals();
    this.notify();
  }

  // 아이템 수량 업데이트
  updateItemQuantity(productId, quantity) {
    const itemIndex = this.state.items.findIndex((item) => item.productId === productId);
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        this.state.items[itemIndex].quantity = quantity;
        this.updateTotals();
        this.notify();
      }
    }
  }

  // 장바구니 비우기
  clearCart() {
    this.state.items = [];
    this.updateTotals();
    this.notify();
  }

  // 총 개수 및 총 가격 계산
  updateTotals() {
    this.state.totalCount = this.state.items.reduce((total, item) => total + item.quantity, 0);
    this.state.totalPrice = this.state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // 현재 장바구니 개수 반환
  getCartCount() {
    return this.state.totalCount;
  }

  // 현재 상태 반환
  getState() {
    return { ...this.state };
  }

  // 특정 상품이 장바구니에 있는지 확인
  hasItem(productId) {
    return this.state.items.some((item) => item.productId === productId);
  }

  // 특정 상품의 수량 반환
  getItemQuantity(productId) {
    const item = this.state.items.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
export const cartStore = new CartStore();
