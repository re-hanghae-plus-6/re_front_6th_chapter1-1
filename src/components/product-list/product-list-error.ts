// 로딩 실패 컴포넌트
export const 상품목록_로딩실패 = (): string => {
  return `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div class="mb-6">
          <svg class="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">상품을 불러올 수 없습니다</h3>
          <p class="text-sm text-gray-600 mb-6">네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.</p>
        </div>
        <button id="retry-button" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium">
          다시 시도
        </button>
      </div>
    `;
};
