import CheckIcon from "../icon/CheckIcon";
import ErrorIcon from "../icon/ErrorIcon";
import InfoIcon from "../icon/InfoIcon";

const backgroundColor = {
  success: "bg-green-600",
  info: "bg-blue-600",
  error: "bg-red-600",
};

const icon = {
  success: CheckIcon,
  info: InfoIcon,
  error: ErrorIcon,
};

export default function Toast({ type = "success", message = "" }) {
  return /* HTML */ ` <div
    class="${backgroundColor[
      type
    ]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm"
  >
    <div class="flex-shrink-0">${icon[type]}</div>
    <p class="text-sm font-medium">${message}</p>
    <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
    </button>
  </div>`;
}
