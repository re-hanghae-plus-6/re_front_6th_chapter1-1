export const cartManager = {
  getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  },

  addToCart(product) {
    const cart = this.getCart();
    const existingItem = cart.find((item) => item.productId === product.productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1, selected: false });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    this.updateCartCount();
  },

  removeFromCart(productId) {
    const cart = this.getCart().filter((item) => item.productId !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    this.updateCartCount();
  },

  increaseQuantity(productId) {
    const cart = this.getCart();
    const existingItem = cart.find((item) => item.productId === productId);

    existingItem.quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    this.updateCartCount();
  },

  decreaseQuantity(productId) {
    const cart = this.getCart();
    const existingItem = cart.find((item) => item.productId === productId);

    if (existingItem.quantity === 1) {
      this.removeFromCart(productId);
    } else {
      existingItem.quantity -= 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      this.updateCartCount();
    }
  },

  getSelectedItems() {
    const cart = this.getCart();
    return cart.filter((item) => item.selected);
  },

  toggleSelected(productId) {
    const cart = this.getCart();

    if (productId) {
      const targetItem = cart.find((item) => item.productId === productId);
      targetItem.selected = !targetItem.selected;
    } else {
      const isAllSelected = cart.every((item) => item.selected);
      cart.forEach((item) => {
        item.selected = !isAllSelected;
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  },

  removeSelectedItems() {
    const cart = this.getCart();
    const updatedCart = cart.filter((item) => !item.selected);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    this.updateCartCount();
  },

  resetCart() {
    localStorage.removeItem("cart");
    this.updateCartCount();
  },

  updateCartCount() {
    const cart = this.getCart();
    // 장바구니 아이콘의 숫자 업데이트
    const cartBadge = document.querySelector("#cart-icon-btn span");
    if (cartBadge) {
      cartBadge.textContent = cart.length;
    }
  },
};
