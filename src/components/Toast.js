const COLORS = {
  success: "bg-green-600",
  info: "bg-blue-600",
  error: "bg-red-600",
};

/**
 * 토스트를 화면에 표시
 * @param {string} message
 * @param {"success"|"info"|"error"} type
 * @param {number} duration
 */
export function showToast(message, type = "success", duration = 3000) {
  const wrapper = document.createElement("div");
  wrapper.className = "fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]";

  wrapper.innerHTML = `
    <div class="${COLORS[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
      <div class="flex-shrink-0">
        ${
          type === "success"
            ? ` <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>`
            : type === "info"
              ? ` <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>`
              : ` <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>`
        }
      </div>
      <p class="text-sm font-medium flex-1">${message}</p>
      <button class="toast-close-btn flex-shrink-0 ml-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>`;

  document.body.appendChild(wrapper);

  const close = () => wrapper.remove();
  wrapper.querySelector(".toast-close-btn").onclick = close;
  setTimeout(close, duration);
}
