import BaseComponent from "@/core/component";
import { getCartCount, showCartModal, subscribeToCartCount } from "@/store";

export default class ProductDetailHeaderComponent extends BaseComponent {
  constructor(target, props) {
    super(target, props);
  }

  componentDidMount() {
    this.initializeEventHandlers();
    subscribeToCartCount(() => {
      this.reRender();
    });
  }

  componentWillUnmount() {
    // 부모 클래스의 componentWillUnmount 호출하여 이벤트 핸들러 정리
    super.componentWillUnmount();
  }

  initializeEventHandlers() {
    // 장바구니 아이콘 클릭 이벤트
    this.addEventDelegate("click", "#cart-icon-btn", (e) => {
      e.preventDefault();
      showCartModal();
    });
  }

  template() {
    const count = getCartCount();
    return /* html */ `
      <header class="bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
        <div class="max-w-md mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold text-gray-900">
              <a href="/" data-link="/" class="hover:text-blue-600 transition-colors">상품 상세</a>
            </h1>
            <div class="flex items-center space-x-2">
              <!-- 장바구니 아이콘 -->
              <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">

                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                </svg>
                <!-- 장바구니 카운트 배지 -->
                ${
                  count > 0
                    ? /* html */ `
                    <span id="cart-count-badge" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      ${count > 99 ? "99+" : count}
                    </span>
                `
                    : ""
                }
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
  }
}
