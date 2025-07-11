import Component from '../../../core/Component.js';
import cartStore from '../../../store/cartStore.js';
import cartLocalStorage from '../../../store/cartLocalStorage.js';
import { useRouter } from '../../../utils/router.js';

class Header extends Component {
  constructor(element, props) {
    super(element, props);
    this.unsubscribeCartStorage = null;
    this.unsubscribeRouter = null;
    this.router = useRouter();
  }

  onMount() {
    // 장바구니 데이터 변경시 자동 리렌더
    this.unsubscribeCartStorage = cartLocalStorage.subscribe('shopping_cart', () => {
      this.render();
    });

    // 라우터 상태 변경시 자동 리렌더 (페이지 이동 시 헤더 업데이트)
    this.unsubscribeRouter = this.router.subscribe(() => {
      this.render();
    });
  }

  onUnmount() {
    // 구독 해제
    if (this.unsubscribeCartStorage) this.unsubscribeCartStorage();
    if (this.unsubscribeRouter) this.unsubscribeRouter();
  }

  attachEventListeners() {
    this.addEventListener(this.element, 'click', (event) => {
      if (event.target.closest('#cart-icon-btn')) {
        cartStore.setState({
          isOpen: true,
        });
      }

      if (event.target.closest('#back-btn')) {
        this.router.back();
      }
    });
  }

  renderNormalHeader() {
    return /* HTML */ `
      <h1 class="text-xl font-bold text-gray-900">
        <a href="/" data-link="">쇼핑몰</a>
      </h1>
    `;
  }

  // detail 페이지 헤더 렌더링
  renderDetailHeader() {
    return /* HTML */ `
      <div class="flex items-center space-x-3">
        <button id="back-btn" class="p-2 text-gray-700 hover:text-gray-900 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
        <h1 class="text-lg font-bold text-gray-900">상품 상세</h1>
      </div>
    `;
  }

  render() {
    const isDetailPage = this.router.isCurrentPathStartsWith('/detail');
    const cartItems = cartLocalStorage.get('shopping_cart') || [];
    const cartItemsLength = cartItems.length || 0;

    this.element.innerHTML = /* HTML */ `
      <header class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            ${!isDetailPage ? this.renderNormalHeader() : this.renderDetailHeader()}
            <div class="flex items-center space-x-2">
              <!-- 장바구니 아이콘 -->
              <button
                id="cart-icon-btn"
                class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
                  ></path>
                </svg>
                ${cartItemsLength
                  ? /* HTML */ `<span
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >${cartItemsLength}</span`
                  : ''}
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
  }
}

export default Header;
