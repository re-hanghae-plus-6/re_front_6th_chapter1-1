import { Component } from "../core/Component";
import { html } from "../utils/html";

export class Header extends Component {
  setup() {
    super.setup();
    this.cartCount = 0;
  }

  renderContainer() {
    return html` <header ${this.dataAttribute.attribute} class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          ${this.props.nav}
          <div class="flex items-center space-x-2">
            <!-- 장바구니 아이콘 -->
            <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
                ></path>
              </svg>
              <span data-id="cart-count"> ${this.#renderCartCount()} </span>
            </button>
          </div>
        </div>
      </div>
    </header>`;
  }

  render() {
    this.$el.querySelector(`[data-id="cart-count"]`).innerHTML = this.#renderCartCount();
  }

  #renderCartCount() {
    return this.cartCount > 0
      ? html`<span
          class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
        >
          ${this.cartCount}
        </span>`
      : "";
  }
}
