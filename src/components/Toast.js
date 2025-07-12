import stateManager from "../state/index.js";

class Toast {
  constructor() {
    this.unsubscribe = null;
  }

  mounted() {
    // toast 상태 변화 구독
    this.unsubscribe = stateManager.ui.subscribe(["toast"], (toast) => {
      this.render(toast);
    });
  }

  unmounted() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  getToastIcon(type) {
    switch (type) {
      case "success":
        return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>';
      case "error":
        return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';
      case "info":
      default:
        return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>';
    }
  }

  getToastColor(type) {
    switch (type) {
      case "success":
        return "bg-green-600";
      case "error":
        return "bg-red-600";
      case "info":
      default:
        return "bg-blue-600";
    }
  }

  render(toast) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    if (!toast) {
      container.innerHTML = "";
      return;
    }

    const { message, type = "info" } = toast;
    const color = this.getToastColor(type);
    const icon = this.getToastIcon(type);

    container.innerHTML = /*html*/ `
      <div class="fixed top-4 right-4 flex flex-col gap-2 items-end z-50">
        <div class="${color} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              ${icon}
            </svg>
          </div>
          <p class="text-sm font-medium">${message}</p>
          <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    // 닫기 버튼 이벤트 연결
    const closeBtn = document.getElementById("toast-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        stateManager.ui.hideToast();
      });
    }
  }
}

export default Toast;
