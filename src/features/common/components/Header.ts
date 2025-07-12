import { Component } from "../../../../componet";
import { EventDelegator } from "../../../../event-delegator";
import { cartStore } from "../../cart/model/cartStore";

type HeaderProps = {
  title?: string;
  canGoBack?: boolean;
};

export class Header extends Component<HeaderProps> {
  subscribeStoreList: Array<() => void> = [];

  render(): HTMLElement {
    // productList의 고유 productId 개수로 카운트
    const cartCount = new Set(cartStore.value.productList.map((v) => v.productId)).size;

    const el = document.createElement("header");
    el.className = "bg-white shadow-sm sticky top-0 z-40";
    el.innerHTML = /* HTML */ `
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            ${this.props.canGoBack
              ? `  <button onclick="window.history.back()" class="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>`
              : ""}
            <h1 class="text-xl font-bold text-gray-900">
              <a href=${window.location.pathname} data-link=${window.location.pathname}>${this.props.title}</a>
            </h1>
          </div>
          <div class="flex items-center space-x-2">
            <!-- 장바구니 아이콘 -->
            <button
              id="cart-icon-btn"
              event-id="cart-btn"
              class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <div>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
                  ></path>
                </svg>
              </div>
              ${cartCount > 0
                ? ` <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                ${cartCount}
                    </span>`
                : ""}
              <!-- 필요시 뱃지 추가 -->
            </button>
          </div>
        </div>
      </div>
    `;
    return el;
  }

  componentDidMount() {
    cartStore.subscribe(() => {
      this.update();
    }),
      EventDelegator.getInstance().register("click", "cart-btn", (e) => {
        const params = new URLSearchParams(window.location.search);

        params.set("cart", "true");
        const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
        window.history.replaceState({}, "", newUrl);
      });
  }

  componentWillUnmount() {
    EventDelegator.getInstance().unregister("click", "cart-btn");
    this.subscribeStoreList.forEach((unsubscribe) => unsubscribe());
  }
}
