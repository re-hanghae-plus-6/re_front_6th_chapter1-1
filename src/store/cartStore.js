export const cartStore = {
  state: {
    cart: [],
  },

  // localStorage에서 cart 데이터 로드
  loadFromStorage() {
    try {
      const savedCart = localStorage.getItem("shopping_cart");
      if (savedCart) {
        this.state.cart = JSON.parse(savedCart);
      } else {
        this.state.cart = [];
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      this.state.cart = [];
    }
  },

  // localStorage에 cart 데이터 저장
  saveToStorage() {
    try {
      localStorage.setItem("shopping_cart", JSON.stringify(this.state.cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  },

  getters: {
    getCart: (state) => state.cart,
  },

  actions: {
    addToCart: (state, product, addQuantity = 1) => {
      // 이미 장바구니에 있는지 확인
      const existingItem = state.cart.find((item) => item.productId === product.productId);

      if (existingItem) {
        // 이미 있으면 수량 증가
        existingItem.quantity += addQuantity;
      } else {
        // 없으면 새로 추가
        state.cart.push({
          ...product,
          quantity: addQuantity,
        });
      }
      // localStorage 업데이트
      cartStore.saveToStorage();
    },

    removeFromCart: (state, productId) => {
      state.cart = state.cart.filter((item) => item.productId !== productId);
      // localStorage 업데이트
      cartStore.saveToStorage();
    },
    removeAllFromCart: (state) => {
      state.cart = [];
      // localStorage 업데이트
      cartStore.saveToStorage();
    },
    updateCartItemQuantity: (state, productId, change) => {
      const item = state.cart.find((item) => item.productId === productId);
      if (item) {
        item.quantity += change;

        // 수량이 0 이하가 되면 장바구니에서 제거
        if (item.quantity <= 0) {
          cartStore.actions.removeFromCart(state, productId);
          return;
        }
      }
      // localStorage 업데이트
      cartStore.saveToStorage();
    },
  },
};
