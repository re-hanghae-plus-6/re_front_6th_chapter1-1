/**
 * @param {string} message - 사용자에게 보여줄 에러 메시지
 * @param {string} retryButtonId - 재시도 버튼 id
 */
const ErrorContent = (message, retryButtonId) => {
  return /* HTML */ `
    <div class="flex flex-col items-center justify-center min-h-[400px] text-center text-gray-700">
      <!-- 에러 아이콘 -->
      <div class="mb-6">
        <svg class="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          ></path>
        </svg>
      </div>

      <!-- 에러 메시지 -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">잠시 문제가 생겼어요</h3>
        <p class="text-gray-600">${message}</p>
      </div>

      <!-- 재시도 버튼 -->
      <button
        id="${retryButtonId}"
        class="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm"
      >
        다시 시도하기
      </button>
    </div>
  `;
};

export default ErrorContent;
