export const Toast = ({ message, type = "success" }) => {
  const getToastConfig = (type) => {
    switch (type) {
      case "success":
        return {
          bgColor: "bg-green-600",
          icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>`,
        };
      case "info":
        return {
          bgColor: "bg-blue-600",
          icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
        };
      case "error":
        return {
          bgColor: "bg-red-600",
          icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>`,
        };
      default:
        return {
          bgColor: "bg-green-600",
          icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>`,
        };
    }
  };

  const config = getToastConfig(type);

  return `
    <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div class="flex flex-col gap-2 items-center justify-center mx-auto" style="width: fit-content;">
        <div class="${config.bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
            <div class="flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${config.icon}
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
    </div>
  `;
};
