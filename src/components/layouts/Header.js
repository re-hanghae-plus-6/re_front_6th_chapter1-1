import { CartIcon } from "../icons/CartIcon";

export function Header(props) {
  const { leftContent } = props;

  return /* HTML */ `<header class="bg-white shadow-sm sticky top-0 z-40">
    <div class="max-w-md mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        ${leftContent}
        <div class="flex items-center space-x-2">
          <!-- 장바구니 아이콘 -->
          <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
            ${CartIcon()}
          </button>
        </div>
      </div>
    </div>
  </header>`;
}
