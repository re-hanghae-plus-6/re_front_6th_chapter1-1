import { openCartModal } from "../cart/CartModal.js";
import cartStore from "../../store/cartStore.js";

function Header(title = "쇼핑몰") {
  return /* HTML */ `
    <header class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-gray-900">
            <a href="/" data-link="">${title}</a>
          </h1>
          <div class="flex items-center space-x-2">
            <!-- 장바구니 아이콘 -->
            <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <span id="cart-count">${cartStore.state.cartItems.length || 0}</span>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  `;
}

// 장바구니 개수 업데이트 함수
function updateCartCount() {
  const cartCountElement = document.getElementById("cart-count");
  if (!cartCountElement) return;
  const itemCount = cartStore.getCartItemCount();

  if (itemCount > 0) {
    cartCountElement.textContent = itemCount;
    cartCountElement.style.display = "flex";
  } else {
    cartCountElement.style.display = "none";
  }
}

function initHeader() {
  const cartIconBtn = document.getElementById("cart-icon-btn");

  if (cartIconBtn) {
    cartIconBtn.addEventListener("click", () => {
      openCartModal();
    });
  }

  // 초기 장바구니 개수 표시
  updateCartCount();

  // cartStore 상태 변화 구독
  cartStore.subscribe(updateCartCount);

  window.addEventListener("cartUpdated", (event) => {
    console.log("전역 이벤트로 장바구니 업데이트:", event.detail);
    updateCartCount();
  });
}
export { Header, initHeader, updateCartCount };
