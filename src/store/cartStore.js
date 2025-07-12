class CartStore {
  constructor() {
    this.state = {
      cartItems: [],
      cartItemCount: 0,
    };
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener());

    requestAnimationFrame(() => {
      this.listeners.forEach((listener) => listener());
    });
  }

  addToCart(productId) {
    const id = parseInt(productId);

    if (this.state.cartItems.includes(id)) {
      return {
        success: false,
        message: "이미 장바구니에 있는 상품입니다.",
        isDuplicate: true,
        currentCount: this.state.cartItemCount,
      };
    }

    this.state.cartItems.push(id);
    this.state.cartItemCount = this.state.cartItems.length;
    this.notify();
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: this.state.cartItemCount }));
    return {
      success: true,
      message: "장바구니에 추가되었습니다.",
      isDuplicate: false,
      currentCount: this.state.cartItemCount,
    };
  }

  removeFromCart(productId) {
    this.state.cartItems = this.state.cartItems.filter((id) => id !== productId);
  }

  getCartItems() {
    return this.state.cartItems;
  }

  getCartItemCount() {
    return this.state.cartItems.length;
  }
}

const cartStore = new CartStore();
export default cartStore;
