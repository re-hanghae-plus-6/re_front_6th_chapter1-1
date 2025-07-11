import { bindAllEvents } from "./bindAllEvents";
import { Router } from "../router/Router";

export const renderHtml = async () => {
  document.body.querySelector("#root").innerHTML = (await Router()) + toastContainer();
  bindAllEvents();
};

const toastContainer = () => {
  if (!window.toastState.type) return "";
  let bgColor = "bg-green-600";
  if (window.toastState.type === "info") bgColor = "bg-blue-600";
  if (window.toastState.type === "error") bgColor = "bg-red-600";
  return `
    <div id="toast-container" style="position: fixed; bottom: 30px; left: 0; right: 0; z-index: 9999; display: flex; justify-content: center; pointer-events: none;">
      <div class="${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm animate-slide-up">
        <div class="flex-shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <p class="text-sm font-medium">${window.toastState.message}</p>
        <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200" style="pointer-events:auto;">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  `;
};
