import { cartStore } from "../store/store.js";

class Header {
  constructor() {
    this.el = null;
    this.state = {
      cartCount: 0, // 초기값. 스토어 구독 후 업데이트됨
    };
  }

  template() {
    // cartCount가 0일 때는 뱃지를 숨김
    const badgeHiddenClass = this.state.cartCount === 0 ? "hidden" : "";

    return `
      <header class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold text-gray-900">
              <a href="/" data-link>쇼핑몰</a>
            </h1>
            <div class="flex items-center space-x-2">
              <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6">
                  </path>
                </svg>
                <span id="cart-count-badge"
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${badgeHiddenClass}">
                  ${this.state.cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  setState(nextState) {
    this.state = { ...this.state, ...nextState };
    this.update(); // 상태 변경 시 전체 렌더링 대신 업데이트만 수행
  }

  update() {
    if (!this.el) return;

    // 뱃지 부분만 찾아서 업데이트
    const cartCountBadge = this.el.querySelector("#cart-count-badge");
    if (cartCountBadge) {
      cartCountBadge.textContent = this.state.cartCount;
      if (this.state.cartCount === 0) {
        cartCountBadge.classList.add("hidden");
      } else {
        cartCountBadge.classList.remove("hidden");
      }
    }
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = this.template().trim();
    this.el = template.content.firstElementChild;

    const btn = this.el.querySelector("#cart-icon-btn");
    btn.addEventListener("click", () => {
      cartStore.setState({ isOpen: true });
    });

    // cartStore를 구독하여 cartCount 상태를 동기화
    // 참고: store에 items가 추가되어야 완벽하게 동작합니다.
    cartStore.subscribe((storeState) => {
      // store에 items가 있다는 가정 하에 cartCount 업데이트
      const newCount = storeState.items ? storeState.items.length : 0;
      this.setState({ cartCount: newCount });
    });

    return this.el;
  }
}

export default Header;
