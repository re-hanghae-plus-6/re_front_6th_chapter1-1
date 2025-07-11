const initialState = {
  isOpen: false,
  items: [], // { id, title, price, image, quantity }
};

export const cartStore = {
  state: { ...initialState },

  subscribers: [],

  subscribe(callback) {
    this.subscribers.push(callback);
    // 구독 시 현재 상태로 즉시 한 번 호출
    callback(this.state);
  },

  notify() {
    this.subscribers.forEach((callback) => callback(this.state));

    this.saveToLocalStorage();
  },

  setState(nextState) {
    this.state = { ...this.state, ...nextState };
    this.notify();
  },

  saveToLocalStorage() {
    try {
      localStorage.setItem("shopping_cart", JSON.stringify(this.state.items));
    } catch (error) {
      console.error("장바구니 저장 실패:", error);
    }
  },

  // localStorage에서 복원
  loadFromLocalStorage() {
    try {
      const savedCart = localStorage.getItem("shopping_cart");
      if (savedCart) {
        const items = JSON.parse(savedCart);
        this.setState({ items });
      }
    } catch (error) {
      console.error("장바구니 복원 실패:", error);
    }
  },

  // 앱 초기화 시 호출할 함수
  initialize() {
    this.loadFromLocalStorage();
  },

  addItem(product) {
    const existingItem = this.state.items.find((item) => item.id === product.productId);
    let newItems;

    if (existingItem) {
      newItems = this.state.items.map((item) =>
        item.id === product.productId ? { ...item, quantity: item.quantity + 1 } : item,
      );
    } else {
      newItems = [
        ...this.state.items,
        {
          id: product.productId,
          title: product.title,
          price: parseInt(product.lprice),
          image: product.image,
          quantity: 1,
          isSelected: true,
        },
      ];
    }
    this.setState({ items: newItems });
  },

  removeItem(productId) {
    const newItems = this.state.items.filter((item) => item.id !== productId);
    this.setState({ items: newItems });
  },

  toggleItemSelection(productId) {
    const newItems = this.state.items.map((item) =>
      item.id === productId ? { ...item, isSelected: !item.isSelected } : item,
    );
    this.setState({ items: newItems });
  },

  toggleAllSelection(selected) {
    const newItems = this.state.items.map((item) => ({ ...item, isSelected: selected }));
    this.setState({ items: newItems });
  },

  removeSelectedItems() {
    const newItems = this.state.items.filter((item) => !item.isSelected);
    this.setState({ items: newItems });
  },

  clearCart() {
    this.setState({ items: [] });
  },

  increaseQuantity(productId) {
    const newItems = this.state.items.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
    );
    this.setState({ items: newItems });
  },

  decreaseQuantity(productId) {
    const newItems = this.state.items
      .map((item) => (item.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item))
      .filter(Boolean);
    this.setState({ items: newItems });
  },

  open() {
    this.setState({ isOpen: true });
  },

  close() {
    this.setState({ isOpen: false });
  },

  reset() {
    this.state = { ...initialState, items: [] };
    this.subscribers = [];
    this.notify();
  },
};
