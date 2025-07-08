import { Toast } from "../shared/components/Toast.js";

let toastIdCounter = 0;

const createToast = (message, type, duration) => {
  const toastId = `toast-${++toastIdCounter}`;
  const toastElement = Toast({ message, type });

  toastElement.id = toastId;
  toastElement.className += " mb-2";

  if (duration > 0) {
    setTimeout(() => toastElement.remove(), duration);
  }

  return toastElement;
};

const showToast = (message, type = "info", duration = 3000) => {
  const container = Toast.getContainer();
  const toast = createToast(message, type, duration);
  container.appendChild(toast);
};

export const showSuccessToast = (message, duration = 3000) => showToast(message, "success", duration);

export const showErrorToast = (message, duration = 3000) => showToast(message, "error", duration);

export const showInfoToast = (message, duration = 3000) => showToast(message, "info", duration);
