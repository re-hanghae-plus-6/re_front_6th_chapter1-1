export class Store {
  constructor() {
    this.state = {
      products: [],
      cart: [],
      filters: {
        search: '',
        category1: '',
        category2: '',
        sort: 'price_asc',
        limit: 20,
        page: 1,
      },
      loading: {
        products: false,
        productDetail: false,
      },
      ui: {
        showCart: false,
        showToast: false,
        toastMessage: '',
      },
    };

    this.listeners = [];

    // 로컬 스토리지에서 장바구니 복원
    this.loadCartFromStorage();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback,
      );
    };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((callback) => callback(this.state));

    // 장바구니 변경 시 로컬 스토리지에 저장
    if (newState.cart) {
      this.saveCartToStorage();
    }
  }

  updateFilters(newFilters) {
    this.setState({
      filters: { ...this.state.filters, ...newFilters, page: 1 },
    });
  }

  addToCart(product, quantity = 1) {
    const existingItem = this.state.cart.find((item) => item.id === product.id);

    let newCart;
    if (existingItem) {
      newCart = this.state.cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    } else {
      newCart = [...this.state.cart, { ...product, quantity }];
    }

    this.setState({ cart: newCart });
    this.showToast('상품이 장바구니에 추가되었습니다!');
  }

  removeFromCart(productId) {
    const newCart = this.state.cart.filter((item) => item.id !== productId);
    this.setState({ cart: newCart });
  }

  updateCartQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const newCart = this.state.cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item,
    );
    this.setState({ cart: newCart });
  }

  clearCart() {
    this.setState({ cart: [] });
  }

  showToast(message) {
    this.setState({
      ui: { ...this.state.ui, showToast: true, toastMessage: message },
    });

    setTimeout(() => {
      this.setState({
        ui: { ...this.state.ui, showToast: false, toastMessage: '' },
      });
    }, 3000);
  }

  toggleCart() {
    this.setState({
      ui: { ...this.state.ui, showCart: !this.state.ui.showCart },
    });
  }

  saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.state.cart));
  }

  loadCartFromStorage() {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.state.cart = JSON.parse(savedCart);
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
    }
  }

  getCartCount() {
    return this.state.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotal() {
    return this.state.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }
}
