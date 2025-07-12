import { render, store, getAppPath } from "../main";
import CartButton from "./CartButton";

const state = {
  isProductDetailPage: false,
};

Header.init = () => {
  const pathname = getAppPath();
  state.isProductDetailPage = pathname.includes("product");
};

Header.mount = () => {
  const cartItems = JSON.parse(window.localStorage.getItem("cart"));
  if (!cartItems) return;
  // let cartLength = cartItems.length;
  store.set("cart", cartItems.length);
  render.draw("#cart-box", CartButton());
  store.watch(
    (newValue) => {
      store.set("cart", newValue);
      render.draw("#cart-box", CartButton());
    },
    ["cart"],
  );
};

export default function Header() {
  return /* html */ `
    <div class="max-w-md mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
      ${
        !state.isProductDetailPage
          ? /* html */ `
        
        <h1 class="text-xl font-bold text-gray-900">
          <a href="javascript:void(0)"  data-link="home">쇼핑몰</a>
        </h1>
        `
          : /* html */ `
        <div class="flex items-center space-x-3">
          <button onclick="window.history.back()" class="p-2 text-gray-700 hover:text-gray-900 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <h1 class="text-lg font-bold text-gray-900">상품 상세</h1>
        </div>
        `
      }

        <div class="flex items-center space-x-2" id="cart-box">
          <!-- 장바구니 아이콘 -->
          ${CartButton()}
        </div>
      </div>
    </div>
  `;
}
