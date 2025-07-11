export function showToast(message = "알림", type = "success") {
  const colorClass =
    {
      success: "bg-green-600",
      info: "bg-blue-600",
      error: "bg-red-600",
    }[type] || "bg-gray-600";

  const iconPath = {
    success: "M5 13l4 4L19 7",
    info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    error: "M6 18L18 6M6 6l12 12",
  }[type];

  const toast = document.createElement("div");
  toast.className = "fixed bottom-4 left-1/2 -translate-x-1/2 z-50";
  toast.innerHTML = /*html*/ `
    <div class="${colorClass} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
      <div class="flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"></path>
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

  // 닫기 버튼 이벤트
  toast.querySelector(".toast-close-btn").addEventListener("click", () => {
    toast.remove();
  });

  document.body.appendChild(toast);

  // 자동 제거 (1.5초 뒤)
  setTimeout(() => {
    toast.remove();
  }, 1500);
}
