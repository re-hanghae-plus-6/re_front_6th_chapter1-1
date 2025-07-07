class Toast {
  constructor() {
    this.root = document.body.querySelector("#root");
  }

  open(type) {
    const toastElement = this.createToast(type);
    this.root.appendChild(toastElement);

    setTimeout(() => {
      this.close(toastElement);
    }, 3000);

    const closeBtn = toastElement.querySelector("#toast-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.close(toastElement);
      });
    }
  }

  createToast(type) {
    const container = document.createElement("div");
    container.className = "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up";

    let htmlContent = "";

    switch (type) {
      case "CREATE":
        htmlContent = /*html */ `<div class="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <p class="text-sm font-medium">장바구니에 추가되었습니다</p>
          <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>`;
        break;

      case "REMOVE":
        htmlContent = /*html*/ `<div class="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
           </svg>
          </div>
          <p class="text-sm font-medium">선택된 상품들이 삭제되었습니다</p>
          <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>`;
        break;

      case "ERROR":
        htmlContent = /*html*/ `<div class="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <p class="text-sm font-medium">오류가 발생했습니다.</p>
          <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>`;
        break;

      default:
        htmlContent = /*html*/ `<div class="bg-gray-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
          <p class="text-sm font-medium">알림</p>
        </div>`;
    }

    container.innerHTML = htmlContent;
    return container;
  }

  close(toastElement) {
    if (toastElement && toastElement.parentNode) {
      toastElement.remove();
    }
  }
}

export const toast = new Toast();
