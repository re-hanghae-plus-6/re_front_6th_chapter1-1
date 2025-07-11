import { addEvent } from "../../utils/eventManager.js";
import { createComponent } from "../../utils/domUtils.js";

const getToastIcon = (type) => {
  switch (type) {
    case "success":
      return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>`;
    case "info":
      return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`;
    case "error":
      return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>`;
    default:
      return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`;
  }
};

const getToastColor = (type) => {
  switch (type) {
    case "success":
      return "bg-green-600";
    case "info":
      return "bg-blue-600";
    case "error":
      return "bg-red-600";
    default:
      return "bg-blue-600";
  }
};

const renderToast = ({ message, type = "info" }) => `
  <div class="${getToastColor(type)} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm animate-slide-up">
    <div class="flex-shrink-0">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        ${getToastIcon(type)}
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

let toastEventListenerInitialized = false;

const ToastComponent = createComponent(
  renderToast,
  { message: "", type: "info" },
  {
    mount: () => {
      if (!toastEventListenerInitialized) {
        addEvent("click", ".toast-close-btn", (e) => {
          const toast = e.target.closest('[id^="toast-"]');
          if (toast) {
            toast.remove();
          }
        });
        toastEventListenerInitialized = true;
      }
    },
  },
);

const getToastContainer = () => {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[100]";
    document.body.appendChild(container);

    ToastComponent.mount();
  }
  return container;
};

export const Toast = ({ message, type = "info" }) => {
  return renderToast({ message, type });
};

Toast.toHTML = renderToast;
Toast.getContainer = getToastContainer;

Toast.create = ({ message, type = "info" }) => {
  const toastElement = document.createElement("div");
  toastElement.innerHTML = renderToast({ message, type });
  return toastElement.firstElementChild;
};

Toast.mount = ToastComponent.mount;
Toast.unmount = ToastComponent.unmount;
