export function showToast({ type = "add" }) {
  const config = {
    add: {
      bg: "bg-green-600",
      message: "장바구니에 추가되었습니다",
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>',
    },
    delete: {
      bg: "bg-blue-600",
      message: "선택한 상품들이 삭제되었습니다",
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    },
    error: {
      bg: "bg-red-600",
      message: "오류가 발생했습니다.",
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>',
    },
  };

  const { bg, message: toastMessage, icon } = config[type];

  // 토스트 HTML 생성
  const toastHTML = `
    <div class="toast-container fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div class="${bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
        <div class="flex-shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${icon}
          </svg>
        </div>
        <p class="text-sm font-medium"> ${toastMessage} </p>
        <button class="toast-close-btn flex-shrink-0 ml-2 text-white hover:text-gray-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  `;

  // 테스트 환경에서는 #root에 추가, 실제 환경에서는 body에 추가
  const container = document.getElementById("root") || document.body;
  container.insertAdjacentHTML("beforeend", toastHTML);

  // 자동으로 3초 후 제거
  const toastElement = document.querySelector(".toast-container:last-child");
  setTimeout(() => {
    toastElement?.remove();
  }, 3000);

  // 닫기 버튼 이벤트
  toastElement?.querySelector(".toast-close-btn")?.addEventListener("click", () => {
    toastElement.remove();
  });
}
