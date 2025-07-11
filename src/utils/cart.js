const storage = window.localStorage;

export const cartManager = {
  getCart() {
    return JSON.parse(storage.getItem("cart") || "[]");
  },

  addToCart(product) {
    const cart = this.getCart();
    const existingItem = cart.find((item) => item.productId === product.productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1, selected: false });
    }

    storage.setItem("cart", JSON.stringify(cart));
    this.updateCartCount();
  },

  removeFromCart(productId) {
    const cart = this.getCart().filter((item) => item.productId !== productId);
    storage.setItem("cart", JSON.stringify(cart));
    this.updateCartCount();
  },

  increaseQuantity(productId) {
    const cart = this.getCart();
    const existingItem = cart.find((item) => item.productId === productId);

    existingItem.quantity += 1;
    storage.setItem("cart", JSON.stringify(cart));
    this.updateCartCount();
  },

  decreaseQuantity(productId) {
    const cart = this.getCart();
    const existingItem = cart.find((item) => item.productId === productId);

    if (existingItem.quantity === 1) {
      this.removeFromCart(productId);
    } else {
      existingItem.quantity -= 1;
      storage.setItem("cart", JSON.stringify(cart));
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

    storage.setItem("cart", JSON.stringify(cart));
  },

  removeSelectedItems() {
    const cart = this.getCart();
    const updatedCart = cart.filter((item) => !item.selected);
    storage.setItem("cart", JSON.stringify(updatedCart));
    this.updateCartCount();
  },

  resetCart() {
    storage.removeItem("cart");
    this.updateCartCount();
  },

  updateCartCount() {
    const cart = this.getCart();
    const cartButton = document.querySelector("#cart-icon-btn");
    let badge = cartButton.querySelector(".cart-count-badge");

    if (cart.length > 0 && cartButton) {
      if (!badge) {
        badge = document.createElement("span");
        badge.className =
          "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center cart-count-badge";
        cartButton.appendChild(badge);
      }
      badge.textContent = cart.length;
    }

    if (cart.length === 0) {
      badge.remove();
    }
  },
};
