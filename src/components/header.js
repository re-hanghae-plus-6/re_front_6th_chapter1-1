// src/components/header.js

/**
 * 공통 Header 생성 함수
 * @param {Object} options
 * @param {string} options.title - 헤더 타이틀
 * @param {boolean} [options.showBackButton] - 뒤로가기 버튼 표시 여부
 * @param {boolean} [options.showCartIcon] - 장바구니 아이콘 표시 여부
 * @param {number|string} [options.cartCount] - 장바구니 개수 뱃지 (없으면 미표시)
 * @param {function} [options.onBack] - 뒤로가기 버튼 클릭 시 실행 함수
 * @returns {string} header HTML 문자열
 */
export function header({ title, showBackButton = false, showCartIcon = false, cartCount }) {
  return `
      <header class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              ${
                showBackButton
                  ? `
                <button onclick="window.history.back()" class="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
              `
                  : ""
              }
              <h1 class="text-xl font-bold text-gray-900">${title}</h1>
            </div>
            <div class="flex items-center space-x-2">
              ${
                showCartIcon
                  ? `
                <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                  </svg>
                  ${
                    cartCount
                      ? `
                    <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      ${cartCount}
                    </span>
                  `
                      : ""
                  }
                </button>
              `
                  : ""
              }
            </div>
          </div>
        </div>
      </header>
    `;
}
