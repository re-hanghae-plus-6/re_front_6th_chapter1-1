import { CartStorage } from "../../utils/CartStorage";
import { CartModal } from "../CartModal";

const cartIcon = (count) => {
  if (count <= 0) return "";
  return `
    <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      ${count}
    </span>
  `;
};

const backButton = () => `
  <button onclick="window.history.back()" class="p-2 text-gray-700 hover:text-gray-900 transition-colors">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
    </svg>
  </button>
`;

/**
 * @param {number} cartCount 장바구니 아이템 개수
 * @param {boolean} isDetail 상품 상세 페이지 여부
 */
const Header = ({ isDetail = false }) => {
  const leftContent = isDetail
    ? `
      <div class="flex items-center space-x-3">
        ${backButton()}
        <h1 class="text-lg font-bold text-gray-900">상품 상세</h1>
      </div>
    `
    : `
      <h1 class="text-xl font-bold text-gray-900">
        <a href="/" data-link="">쇼핑몰</a>
      </h1>
    `;

  // init 함수 추가
  Header.init = () => {
    const cartIconBtn = document.getElementById("cart-icon-btn");
    if (cartIconBtn) {
      // 기존 이벤트 리스너 제거 (중복 방지)
      cartIconBtn.removeEventListener("click", handleCartClick);
      // 새 이벤트 리스너 추가
      cartIconBtn.addEventListener("click", handleCartClick);

      // CartStorage 카운터 시스템에 등록
      CartStorage.registerCounter(cartIconBtn);
    }

    // CartStorage 카운터 시스템 초기화
    CartStorage.initCounter();
  };

  // 장바구니 아이콘 클릭 시 모달 열기
  const handleCartClick = () => {
    CartModal.open();
  };

  return /* HTML */ `
    <header class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          ${leftContent}
          <div class="flex items-center space-x-2">
            <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
                ></path>
              </svg>
              ${cartIcon(CartStorage.getTotalCount())}
            </button>
          </div>
        </div>
      </div>
    </header>
  `;
};

export default Header;
