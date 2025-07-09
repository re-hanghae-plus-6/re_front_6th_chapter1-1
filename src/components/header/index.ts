export interface HeaderProps {
  /** 표시할 장바구니 개수(0이면 배지 숨김) */
  cartCount?: number;
  /** 헤더 좌측에 표시할 타이틀 */
  title?: string;
  /** 뒤로가기 버튼 표시 여부 */
  showBackButton?: boolean;
}

/** 공통 헤더 컴포넌트 */
export const 공통_헤더 = ({ cartCount = 0, title = "쇼핑몰", showBackButton = false }: HeaderProps = {}): string => {
  const badgeHtml =
    cartCount > 0
      ? `<span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">${cartCount}</span>`
      : "";

  // 왼쪽 영역(뒤로가기 + 타이틀 또는 홈 링크)
  const leftHtml = showBackButton
    ? `<div class="flex items-center space-x-3">
          <button onclick="window.history.back()" class="p-2 text-gray-700 hover:text-gray-900 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-lg font-bold text-gray-900">${title}</h1>
        </div>`
    : `<h1 class="text-xl font-bold text-gray-900">
          <a href="/" data-link="">${title}</a>
        </h1>`;

  return `
    <header class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          ${leftHtml}
          <div class="flex items-center space-x-2">
            <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6" />
              </svg>
              ${badgeHtml}
            </button>
          </div>
        </div>
      </div>
    </header>`;
};
