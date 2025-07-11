import { cartStore } from "../store/store.js";
import { navigate } from "../router/router.js";

class Header {
  constructor() {
    this.el = null;
    this.state = {
      cartCount: 0,
    };

    this.handlePopstate = this.handlePopstate.bind(this);
    this.handleUrlChange = this.handleUrlChange.bind(this);

    cartStore.subscribe((storeState) => {
      const newCount = storeState.items ? storeState.items.length : 0;
      this.setState({ cartCount: newCount });
    });
  }

  handlePopstate() {
    this.updateHeader();
  }

  handleUrlChange() {
    this.updateHeader();
  }

  updateHeader() {
    if (this.el) {
      const oldEl = this.el;
      const newEl = this.render();
      if (oldEl.parentNode) {
        oldEl.parentNode.replaceChild(newEl, oldEl);
      }
      this.el = newEl;
    }
  }

  badgeTemplate() {
    // 뱃지 span 찾기
    let cartCountBadge = this.el.querySelector("#cart-count-badge");

    if (this.state.cartCount === 0) {
      // 0개면 뱃지 제거
      if (cartCountBadge) cartCountBadge.remove();
    } else {
      // 1개 이상이면 뱃지가 없으면 새로 생성
      if (!cartCountBadge) {
        const btn = this.el.querySelector("#cart-icon-btn");
        cartCountBadge = document.createElement("span");
        cartCountBadge.id = "cart-count-badge";
        cartCountBadge.className =
          "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center";
        btn.appendChild(cartCountBadge);
      }
      cartCountBadge.textContent = this.state.cartCount;
      cartCountBadge.classList.remove("hidden");
    }
  }

  template() {
    const badgeHiddenClass = this.state.cartCount === 0 ? "hidden" : "";
    const isDetailPage = window.location.pathname.startsWith("/product/");

    return `
      <header class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            ${
              isDetailPage
                ? `
              <div class="flex items-center space-x-3">
                <button onclick="window.history.back()" class="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <h1 class="text-lg font-bold text-gray-900">상품 상세</h1>
              </div>
            `
                : `
              <h1 class="text-xl font-bold text-gray-900">
                <a href="#" id="home-link" data-link>쇼핑몰</a>
              </h1>
            `
            }
            <div class="flex items-center space-x-2">
              <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6">
                  </path>
                </svg>${
                  this.state.cartCount > 0
                    ? `
                <span id="cart-count-badge"
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${badgeHiddenClass}">
                  ${this.state.cartCount}
                </span>`
                    : ""
                }
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  setState(nextState) {
    this.state = { ...this.state, ...nextState };
    this.update();
  }

  update() {
    if (!this.el) return;

    this.badgeTemplate();
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = this.template().trim();
    const newEl = template.content.firstElementChild;

    // 기존 엘리먼트가 있다면 교체
    if (this.el && this.el.parentNode) {
      this.el.parentNode.replaceChild(newEl, this.el);
    }
    this.el = newEl;

    const btn = this.el.querySelector("#cart-icon-btn");
    btn.addEventListener("click", () => {
      cartStore.setState({ isOpen: true });
    });

    // 홈 링크 SPA 라우팅 처리
    const homeLink = this.el.querySelector("#home-link");
    if (homeLink) {
      homeLink.addEventListener("click", (e) => {
        e.preventDefault();
        navigate("/");
      });
    }

    // popstate 이벤트 리스너 추가 (한 번만 추가되도록)
    window.removeEventListener("popstate", this.handlePopstate);
    window.addEventListener("popstate", this.handlePopstate);

    // URL 변경 감지를 위한 커스텀 이벤트 리스너 추가
    window.removeEventListener("urlchange", this.handleUrlChange);
    window.addEventListener("urlchange", this.handleUrlChange);

    return this.el;
  }
}

export default Header;
