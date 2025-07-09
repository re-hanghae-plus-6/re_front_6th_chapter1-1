export class Store {
  constructor() {
    this.state = {
      products: [],
      allProducts: [], // 무한 스크롤을 위한 누적 상품 목록
      cart: [],
      pagination: null, // 페이지네이션 정보
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
        loadingMore: false, // 추가 로딩 상태
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
    const updatedFilters = { ...this.state.filters, ...newFilters, page: 1 };

    this.setState({
      filters: updatedFilters,
      allProducts: [], // 필터 변경 시 누적 상품 초기화
      pagination: null,
    });

    // 필터 변경 시 URL 파라미터 업데이트 (current는 초기화)
    if (typeof window !== 'undefined' && window.updateURLParams) {
      window.updateURLParams({
        current: 0, // 첫 페이지로 리셋
        category1: updatedFilters.category1,
        category2: updatedFilters.category2,
        search: updatedFilters.search,
        sort: updatedFilters.sort,
        limit: updatedFilters.limit,
      });
    }
  }

  resetToInitialState() {
    // 필터를 초기 상태로 리셋 (장바구니는 유지)
    this.setState({
      filters: {
        search: '',
        category1: '',
        category2: '',
        sort: 'price_asc',
        limit: 20,
        page: 1,
      },
      allProducts: [],
      pagination: null,
      ui: {
        ...this.state.ui,
        showCart: false, // 장바구니 모달도 닫기
      },
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

  removeFromCart(productId, showToast = true) {
    const removedItem = this.state.cart.find((item) => item.id === productId);
    const newCart = this.state.cart.filter((item) => item.id !== productId);
    this.setState({ cart: newCart });

    if (removedItem && showToast) {
      this.showToast('상품이 장바구니에서 삭제되었습니다', 'info');
    }
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

  showToast(message, type = 'success') {
    // 토스트 UI 상태 업데이트 (호환성을 위해 유지)
    this.setState({
      ui: {
        ...this.state.ui,
        showToast: true,
        toastMessage: message,
        toastType: type,
      },
    });

    // ToastManager를 통해 실제 토스트 표시 (main.js에서 처리)
    if (typeof window !== 'undefined' && window.toastManager) {
      window.toastManager.show(message, type);
    }

    // 상태 초기화 (UI 상태 동기화)
    setTimeout(() => {
      this.setState({
        ui: {
          ...this.state.ui,
          showToast: false,
          toastMessage: '',
          toastType: '',
        },
      });
    }, 2000);
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
    // 서로 다른 상품의 종류 개수만 반환 (수량과 관계없이)
    return this.state.cart.length;
  }

  getCartTotalQuantity() {
    // 모든 상품의 총 수량 (기존 getCartCount 기능)
    return this.state.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotal() {
    return this.state.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }
}
