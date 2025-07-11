export const cartManager = {
  getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  },

  addToCart(product) {
    const cart = this.getCart();
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    this.updateCartCount();
  },

  removeFromCart(productId) {
    const cart = this.getCart().filter((item) => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    this.updateCartCount();
  },

  resetCart() {
    localStorage.removeItem("cart");
    this.updateCartCount();
  },

  updateCartCount() {
    const cart = this.getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    // 장바구니 아이콘의 숫자 업데이트
    const cartBadge = document.querySelector("#cart-icon-btn span");
    if (cartBadge) {
      cartBadge.textContent = count;
    }
  },
};
