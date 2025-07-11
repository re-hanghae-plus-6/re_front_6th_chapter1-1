// 토스트 팝업 관련 유틸리티 함수들

// 토스트 팝업 생성 및 표시
const showToast = (message, type = "success") => {
  // 기존 토스트가 있다면 제거
  const existingToast = document.querySelector(".toast-notification");
  if (existingToast) {
    existingToast.remove();
  }

  // 토스트 타입에 따른 스타일 설정
  const toastStyles = {
    success: {
      bgColor: "bg-green-600",
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>`,
    },
    info: {
      bgColor: "bg-blue-600",
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>`,
    },
    error: {
      bgColor: "bg-red-600",
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>`,
    },
  };

  const style = toastStyles[type];

  // 토스트 HTML 생성
  const toastHTML = `
    <div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 toast-notification">
      <div class="${style.bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
        <div class="flex-shrink-0">
          ${style.icon}
        </div>
        <p class="text-sm font-medium">${message}</p>
        <button class="toast-close-btn flex-shrink-0 ml-2 text-white hover:text-gray-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  `;

  // 토스트를 body에 추가
  document.body.insertAdjacentHTML("beforeend", toastHTML);

  // 토스트 닫기 버튼 이벤트 리스너
  const closeBtn = document.querySelector(".toast-close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      const toast = document.querySelector(".toast-notification");
      if (toast) {
        toast.remove();
      }
    });
  }

  // 3초 후 자동으로 토스트 제거
  setTimeout(() => {
    const toast = document.querySelector(".toast-notification");
    if (toast) {
      toast.remove();
    }
  }, 3000);
};

// 장바구니 추가 성공 토스트
export const showAddToCartToast = () => {
  showToast("장바구니에 추가되었습니다", "success");
};

// 선택 상품 삭제 성공 토스트
export const showRemoveSelectedToast = () => {
  showToast("선택된 상품들이 삭제되었습니다", "info");
};

// 오류 발생 토스트
export const showErrorToast = (message = "오류가 발생했습니다.") => {
  showToast(message, "error");
};
