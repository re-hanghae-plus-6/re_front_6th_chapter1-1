export const Toast = (() => {
  // Private 변수들
  let toastContainer = null;
  let activeToasts = new Map();
  let toastIdCounter = 0;

  /* 컨테이너 생성 */
  function createContainer() {
    if (toastContainer) return toastContainer;

    toastContainer = document.createElement("div");
    toastContainer.className =
      "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 items-center justify-center";
    document.body.appendChild(toastContainer);

    return toastContainer;
  }

  /* 토스트 HTML 생성 */
  function createToastHTML(type, message) {
    const configs = {
      success: {
        bgColor: "bg-green-600",
        icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>`,
      },
      info: {
        bgColor: "bg-blue-600",
        icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
      },
      error: {
        bgColor: "bg-red-600",
        icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>`,
      },
    };

    const config = configs[type] || configs.info;

    return `
        <div class="${config.bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm opacity-0 transform translate-x-full transition-all duration-300">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              ${config.icon}
            </svg>
          </div>
          <p class="text-sm font-medium">${message}</p>
          <button class="toast-close-btn flex-shrink-0 ml-2 text-white hover:text-gray-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      `;
  }

  /* 토스트 표시 */
  function showToast(type, message, duration = 3000) {
    const container = createContainer();
    const toastId = ++toastIdCounter;

    // 토스트 생성
    const toastWrapper = document.createElement("div");
    toastWrapper.innerHTML = createToastHTML(type, message);
    const toastElement = toastWrapper.firstElementChild;

    // 컨테이너에 추가
    container.appendChild(toastElement);
    activeToasts.set(toastId, toastElement);

    // 애니메이션 (슬라이드 인)
    requestAnimationFrame(() => {
      toastElement.style.opacity = "1";
      toastElement.style.transform = "translateX(0)";
    });

    // 닫기 버튼 이벤트
    const closeBtn = toastElement.querySelector(".toast-close-btn");
    closeBtn.addEventListener("click", () => removeToast(toastId));

    // 자동 제거
    if (duration > 0) {
      setTimeout(() => removeToast(toastId), duration);
    }

    return toastId;
  }

  /* 토스트 제거 */
  function removeToast(toastId) {
    const toastElement = activeToasts.get(toastId);
    if (!toastElement) return;

    // 슬라이드 아웃 애니메이션
    toastElement.style.opacity = "0";
    toastElement.style.transform = "translateX(100%)";

    setTimeout(() => {
      if (toastElement.parentNode) {
        toastElement.parentNode.removeChild(toastElement);
      }
      activeToasts.delete(toastId);

      // 모든 토스트가 제거되면 컨테이너도 제거
      if (activeToasts.size === 0 && toastContainer) {
        document.body.removeChild(toastContainer);
        toastContainer = null;
      }
    }, 300);
  }

  /* Public API */
  return {
    success(message, duration) {
      return showToast("success", message, duration);
    },

    info(message, duration) {
      return showToast("info", message, duration);
    },

    error(message, duration) {
      return showToast("error", message, duration);
    },
  };
})();
