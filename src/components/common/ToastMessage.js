import { CloseIcon } from "../icons/CloseIcon";
import { ToastCheckIcon } from "../icons/ToastCheckIcon";
import { ToastErrorIcon } from "../icons/ToastErrorIcon";
import { ToastInfoIcon } from "../icons/ToastInfoIcon";

export function ToastMessage(props) {
  const { type = "info", message = "" } = props;

  const toastConfig = {
    success: {
      color: "green",
      icon: ToastCheckIcon,
    },
    info: {
      color: "blue",
      icon: ToastInfoIcon,
    },
    error: {
      color: "red",
      icon: ToastErrorIcon,
    },
  }[type];

  return /* HTML */ `
    <div
      class="bg-${toastConfig.color}-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm"
    >
      <div class="flex-shrink-0">${toastConfig.icon()}</div>
      <p class="text-sm font-medium">${message}</p>
      <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
        ${CloseIcon({ className: "w-4 h-4 pointer-events-none" })}
      </button>
    </div>
  `;
}
