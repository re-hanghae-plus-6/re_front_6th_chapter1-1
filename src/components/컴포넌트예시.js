const Header = {
  el: null,

  state: {
    cartCount: 0,
  },

  // 👉 템플릿 생성
  template() {
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
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  ${this.state.cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
  },

  // 👉 DOM 렌더
  render() {
    const template = document.createElement("template");
    template.innerHTML = this.template().trim();
    const newEl = template.content.firstElementChild;

    if (!newEl) {
      console.error("Header: 렌더링 실패 - 유효한 DOM이 없음");
      return document.createTextNode(""); // fallback
    }

    if (!this.el) {
      this.el = newEl;
      return this.el;
    }

    // 기존 요소가 있다면 교체 후 이벤트 재등록
    this.el.replaceWith(newEl);
    this.el = newEl;
    this.addEvent();
    return this.el;
  },

  // 👉 이벤트 바인딩
  addEvent() {
    const btn = this.el?.querySelector("#cart-icon-btn");
    if (btn) {
      btn.addEventListener("click", () => {
        document.querySelector(".min-h-full")?.classList.remove("hidden");
      });
    }
  },

  // 👉 상태 변경 및 자동 렌더
  setState(nextState) {
    this.state = { ...this.state, ...nextState };
    this.render();
  },

  // 👉 초기화
  init() {
    const el = this.render();
    this.addEvent();
    return el;
  },
};

export default Header;
