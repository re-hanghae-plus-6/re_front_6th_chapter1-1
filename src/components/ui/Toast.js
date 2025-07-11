export default function Toast({ type = "success", message = "", showCloseButton = true }) {
  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-600 text-white";
      case "info":
        return "bg-blue-600 text-white";
      case "error":
        return "bg-red-600 text-white";
      default:
        return "bg-green-600 text-white";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return /*html*/ `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        `;
      case "info":
        return /*html*/ `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
         </svg>
        `;
      case "error":
        return /*html*/ `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        `;
      default:
        return "";
    }
  };

  const closeButton = showCloseButton
    ? /*html*/ `
    <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  `
    : "";

  return /*html*/ `
    <div class="${getStyles()} px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
      <div class="flex-shrink-0">
        ${getIcon()}
      </div>
      <p class="text-sm font-medium">${message}</p>
      ${closeButton}
    </div>
  `;
}

export function ToastContainer({ toasts = [] }) {
  return /*html*/ `
    <div class="flex flex-col gap-2 items-center justify-center mx-auto" style="width: fit-content;">
      ${toasts.map((toast) => Toast(toast)).join("")}
    </div>
  `;
}
