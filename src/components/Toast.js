class Toast {
  constructor() {
    this.el = null;
  }

  showSuccess(message = "장바구니에 추가되었습니다") {
    this.show(message, "success");
  }

  showInfo(message) {
    this.show(message, "info");
  }

  showError(message = "오류가 발생했습니다") {
    this.show(message, "error");
  }

  show(message, type = "success") {
    this.hide();

    const $toast = document.createElement("div");
    $toast.className = "fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out";
    $toast.id = "toast-message";

    const bgColor = type === "success" ? "bg-green-600" : type === "info" ? "bg-blue-600" : "bg-red-600";
    const icon = this.getIcon(type);

    $toast.innerHTML = `
      <div class="${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
        <div class="flex-shrink-0">
          ${icon}
        </div>
        <p class="text-sm font-medium">${message}</p>
        <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild($toast);
    this.el = $toast;

    // 닫기 버튼 이벤트
    const closeBtn = $toast.querySelector("#toast-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.hide();
      });
    }

    // 3초 후 자동으로 닫기
    setTimeout(() => {
      this.hide();
    }, 3000);
  }

  // 토스트 메시지 숨기기
  hide() {
    if (this.el && document.body.contains(this.el)) {
      document.body.removeChild(this.el);
      this.el = null;
    }
  }

  // 아이콘 가져오기
  getIcon(type) {
    switch (type) {
      case "success":
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>`;
      case "info":
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`;
      case "error":
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>`;
      default:
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>`;
    }
  }
}

// 싱글톤 인스턴스 생성
const toast = new Toast();

export default toast;
