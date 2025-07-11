import { Store } from "@/core/store";
import createPersistStore from "@/core/persist-store";

/**
 * 장바구니 초기 상태
 */
const CART_INITIAL_STATE = {
  items: [],
  count: 0,
  totalPrice: 0,
  isVisible: false, // 장바구니 모달 표시 여부
  // 선택 상태 관리
  selectedItems: [], // 선택된 아이템 ID 배열
  isAllSelected: false, // 전체 선택 여부
};

/**
 * 장바구니 스토어 클래스
 */
class CartStore extends Store {
  constructor() {
    super(CART_INITIAL_STATE);
    this.setupPersistStore();
  }

  setupInitial() {
    if (!localStorage.getItem("shopping_cart")) {
      localStorage.setItem("shopping_cart", JSON.stringify(CART_INITIAL_STATE));
    }
  }

  resetInitialState() {
    this.state = { ...CART_INITIAL_STATE };
  }

  /**
   * 영구 저장소 설정
   */
  setupPersistStore() {
    this.persistStore = createPersistStore(this, {
      storageType: "local",
      storageKey: "shopping_cart",
      whitelist: ["items", "count", "totalPrice", "selectedItems", "isAllSelected"],
      debounceTime: 0,
      version: 1,
      transforms: [
        {
          // 저장 시 데이터 최적화
          out: (state) => ({
            ...state,
            items:
              state.items?.map((item) => ({
                id: item.id,
                title: item.title,
                lprice: item.lprice,
                image: item.image,
                quantity: item.quantity || 1,
                addedAt: item.addedAt || Date.now(),
              })) || [],
          }),
          // 복원 시 7일 이상 된 아이템 제거 및 선택 상태 정리
          in: (state) => {
            const validItems = state.items?.filter((item) => item.addedAt > Date.now() - 7 * 24 * 60 * 60 * 1000) || [];

            // 총 가격 계산
            const totalPrice = validItems.reduce((total, item) => {
              return total + parseInt(item.lprice) * (item.quantity || 1);
            }, 0);

            // 유효한 아이템 ID만 선택 상태에 유지
            const validItemIds = new Set(validItems.map((item) => item.id));
            const validSelectedItems = (state.selectedItems || []).filter((id) => validItemIds.has(id));

            return {
              ...state,
              items: validItems,
              count: validItems.length,
              totalPrice,
              selectedItems: validSelectedItems,
              isAllSelected: validItems.length > 0 && validSelectedItems.length === validItems.length,
            };
          },
        },
      ],
    });
  }

  /**
   * 장바구니 아이템들을 반환
   * @returns {Array} 장바구니 아이템 배열
   */
  getItems() {
    return this.getStateByKey("items") || [];
  }

  /**
   * 장바구니 아이템 개수 반환
   * @returns {number} 아이템 개수
   */
  getCount() {
    return this.getStateByKey("count") || 0;
  }

  /**
   * 장바구니 총 가격 반환
   * @returns {number} 총 가격
   */
  getTotalPrice() {
    return this.getStateByKey("totalPrice") || 0;
  }

  /**
   * 장바구니 모달 표시 여부 반환
   * @returns {boolean} 모달 표시 여부
   */
  getIsVisible() {
    return this.getStateByKey("isVisible") || false;
  }

  /**
   * 선택된 아이템 ID 배열 반환
   * @returns {Array} 선택된 아이템 ID 배열
   */
  getSelectedItems() {
    return this.getStateByKey("selectedItems") || [];
  }

  /**
   * 전체 선택 여부 반환
   * @returns {boolean} 전체 선택 여부
   */
  getIsAllSelected() {
    return this.getStateByKey("isAllSelected") || false;
  }

  /**
   * 총 가격 계산
   * @param {Array} items - 장바구니 아이템 배열
   * @returns {number} 총 가격
   */
  calculateTotalPrice(items) {
    return items.reduce((total, item) => {
      return total + parseInt(item.lprice) * (item.quantity || 1);
    }, 0);
  }

  /**
   * 장바구니 아이템 추가
   * @param {Object} product - 추가할 상품
   */
  addItem(product) {
    const currentItems = this.getItems();
    const existingItemIndex = currentItems.findIndex((item) => item.id === product.id);

    let newItems;
    if (existingItemIndex !== -1) {
      // 기존 아이템 수량 증가
      newItems = currentItems.map((item, index) =>
        index === existingItemIndex ? { ...item, quantity: (item.quantity || 1) + 1 } : item,
      );
    } else {
      // 새 아이템 추가
      newItems = [
        ...currentItems,
        {
          ...product,
          quantity: 1,
          addedAt: Date.now(),
        },
      ];
    }

    this.updateCartState(newItems, "ADD_ITEM");
  }

  bulkAddItem(product, quantity) {
    const currentItems = this.getItems();
    const existingItemIndex = currentItems.findIndex((item) => item.id === product.id);

    let newItems;
    if (existingItemIndex !== -1) {
      // 기존 아이템 수량 증가
      newItems = currentItems.map((item, index) =>
        index === existingItemIndex ? { ...item, quantity: (item.quantity || 1) + quantity } : item,
      );
    } else {
      // 새 아이템 추가
      newItems = [
        ...currentItems,
        {
          ...product,
          quantity: quantity,
          addedAt: Date.now(),
        },
      ];
    }

    this.updateCartState(newItems, "BULK_ADD_ITEM");
  }

  /**
   * 장바구니 아이템 제거
   * @param {string} productId - 제거할 상품 ID
   */
  removeItem(productId) {
    const currentItems = this.getItems();
    const newItems = currentItems.filter((item) => item.id !== productId);

    // 선택 상태에서도 제거
    const selectedItems = this.getSelectedItems();
    const newSelectedItems = selectedItems.filter((id) => id !== productId);

    this.updateCartStateWithSelection(newItems, newSelectedItems, "REMOVE_ITEM");
  }

  /**
   * 장바구니 아이템 수량 업데이트
   * @param {string} productId - 상품 ID
   * @param {number} quantity - 새로운 수량
   */
  updateItemQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const currentItems = this.getItems();
    const newItems = currentItems.map((item) => (item.id === productId ? { ...item, quantity } : item));

    this.updateCartState(newItems, "UPDATE_QUANTITY");
  }

  /**
   * 장바구니 아이템 수량 증가
   * @param {string} productId - 상품 ID
   */
  increaseItemQuantity(productId) {
    const currentItems = this.getItems();
    const item = currentItems.find((item) => item.id === productId);
    if (item) {
      this.updateItemQuantity(productId, (item.quantity || 1) + 1);
    }
  }

  /**
   * 장바구니 아이템 수량 감소
   * @param {string} productId - 상품 ID
   */
  decreaseItemQuantity(productId) {
    const currentItems = this.getItems();
    const item = currentItems.find((item) => item.id === productId);
    if (item) {
      this.updateItemQuantity(productId, Math.max(0, (item.quantity || 1) - 1));
    }
  }

  /**
   * 장바구니 비우기
   */
  clearCart() {
    this.updateCartStateWithSelection([], [], "CLEAR_CART");
  }

  /**
   * 전체 선택/해제
   * @param {boolean} isSelected - 선택 여부
   */
  selectAll(isSelected) {
    const items = this.getItems();
    const selectedItems = isSelected ? items.map((item) => item.id) : [];

    this.setStates(
      {
        selectedItems,
        isAllSelected: isSelected,
      },
      "SELECT_ALL",
    );
  }

  /**
   * 개별 아이템 선택/해제
   * @param {string} productId - 상품 ID
   * @param {boolean} isSelected - 선택 여부
   */
  selectItem(productId, isSelected) {
    const currentSelectedItems = this.getSelectedItems();
    let newSelectedItems;

    if (isSelected) {
      newSelectedItems = [...new Set([...currentSelectedItems, productId])];
    } else {
      newSelectedItems = [...new Set(currentSelectedItems.filter((id) => id !== productId))];
    }

    const items = this.getItems();
    const isAllSelected = items.length > 0 && newSelectedItems.length === items.length;

    this.setStates(
      {
        selectedItems: newSelectedItems,
        isAllSelected,
      },
      "SELECT_ITEM",
    );
  }

  /**
   * 선택된 아이템들 삭제
   */
  removeSelectedItems() {
    const currentItems = this.getItems();
    const selectedItems = this.getSelectedItems();
    const newItems = currentItems.filter((item) => !selectedItems.includes(item.id));

    this.updateCartStateWithSelection(newItems, [], "REMOVE_SELECTED");
  }

  /**
   * 장바구니 모달 표시/숨김 토글
   */
  toggleVisibility() {
    this.setState("isVisible", !this.getIsVisible(), "TOGGLE_VISIBILITY");
  }

  /**
   * 장바구니 모달 표시
   */
  showCart() {
    this.setState("isVisible", true, "SHOW_CART");
  }

  /**
   * 장바구니 모달 숨김
   */
  hideCart() {
    this.setState("isVisible", false, "HIDE_CART");
  }

  /**
   * 장바구니 상태 업데이트 (내부 메서드)
   * @param {Array} items - 새로운 아이템 배열
   * @param {string} action - 액션 타입
   */
  updateCartState(items, action) {
    const totalPrice = this.calculateTotalPrice(items);

    this.setStates(
      {
        items,
        count: items.length,
        totalPrice,
      },
      action,
    );
  }

  /**
   * 장바구니 상태와 선택 상태 함께 업데이트 (내부 메서드)
   * @param {Array} items - 새로운 아이템 배열
   * @param {Array} selectedItems - 새로운 선택된 아이템 ID 배열
   * @param {string} action - 액션 타입
   */
  updateCartStateWithSelection(items, selectedItems, action) {
    const totalPrice = this.calculateTotalPrice(items);
    const isAllSelected = items.length > 0 && selectedItems.length === items.length;

    this.setStates(
      {
        items,
        count: items.length,
        totalPrice,
        selectedItems,
        isAllSelected,
      },
      action,
    );
  }

  /**
   * 특정 상품이 장바구니에 있는지 확인
   * @param {string} productId - 상품 ID
   * @returns {boolean} 장바구니에 있는지 여부
   */
  hasItem(productId) {
    return this.getItems().some((item) => item.id === productId);
  }

  /**
   * 특정 상품의 수량 반환
   * @param {string} productId - 상품 ID
   * @returns {number} 상품 수량
   */
  getItemQuantity(productId) {
    const item = this.getItems().find((item) => item.id === productId);
    return item ? item.quantity || 1 : 0;
  }

  /**
   * 특정 상품이 선택되어 있는지 확인
   * @param {string} productId - 상품 ID
   * @returns {boolean} 선택 여부
   */
  isItemSelected(productId) {
    return this.getSelectedItems().includes(productId);
  }

  /**
   * 선택된 아이템들의 총 가격 계산
   * @returns {number} 선택된 아이템들의 총 가격
   */
  getSelectedItemsTotal() {
    const items = this.getItems();
    const selectedItems = this.getSelectedItems();

    return items
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + parseInt(item.lprice) * (item.quantity || 1), 0);
  }

  /**
   * 장바구니 상태 요약 정보 반환
   * @returns {Object} 장바구니 요약 정보
   */
  getSummary() {
    const items = this.getItems();
    const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const selectedItems = this.getSelectedItems();

    return {
      itemCount: items.length,
      totalQuantity,
      totalPrice: this.getTotalPrice(),
      isEmpty: items.length === 0,
      selectedCount: selectedItems.length,
      selectedTotal: this.getSelectedItemsTotal(),
      isAllSelected: this.getIsAllSelected(),
    };
  }

  /**
   * 장바구니를 초기 상태로 완전히 리셋
   * 테스트 환경에서 사용하기 위한 메서드
   */
  reset() {
    // 모든 구독자 해제
    this.subscribers.clear();

    // 상태를 초기 상태로 리셋
    this.state = { ...CART_INITIAL_STATE };

    // localStorage에서 장바구니 데이터 제거
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("shopping_cart");
    }

    // 퍼시스트 스토어 재설정
    this.setupPersistStore();

    // 상태 변경을 알림
    this.notify("RESET");
  }
}

/**
 * 장바구니 스토어 인스턴스 생성
 */
const cartStore = new CartStore();

// 개발 환경에서 전역 접근 가능하도록 설정
if (process.env.NODE_ENV === "development") {
  window.cartStore = cartStore;
}

export { CartStore, CART_INITIAL_STATE };
export default cartStore;
