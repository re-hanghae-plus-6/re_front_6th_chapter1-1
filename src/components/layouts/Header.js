import { CartIcon } from "../icons/CartIcon";

export function Header(props) {
  const { leftContent, cartItemCount } = props;

  return /* HTML */ `<header class="bg-white shadow-sm sticky top-0 z-40">
    <div class="max-w-md mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        ${leftContent}
        <div class="flex items-center space-x-2">
          <!-- 장바구니 아이콘 -->
          <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
            ${CartIcon({ className: "w-6 h-6 pointer-events-none" })}
            ${cartItemCount > 0
              ? /* HTML */ `<span
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  ${cartItemCount}
                </span>`
              : ""}
          </button>
        </div>
      </div>
    </div>
  </header>`;
}
