export function Toast() {
  return `
    <div id="toast" class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 translate-y-0 opacity-100">
      <div class="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>상품이 장바구니에 추가되었습니다!</span>
      </div>
    </div>
  `;
}
