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
  },

  setState(nextState) {
    this.state = { ...this.state, ...nextState };
    this.notify();
  },

  open() {
    this.setState({ isOpen: true });
  },

  close() {
    this.setState({ isOpen: false });
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
        },
      ];
    }
    this.setState({ items: newItems });
  },

  removeItem(productId) {
    const newItems = this.state.items.filter((item) => item.id !== productId);
    this.setState({ items: newItems });
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
      .filter(Boolean); // 수량이 0이 되면 제거될 수 있으므로 filter(Boolean)은 안전장치
    this.setState({ items: newItems });
  },

  reset() {
    this.state = { ...initialState, items: [] };
    this.subscribers = [];
    this.notify();
  },
};
