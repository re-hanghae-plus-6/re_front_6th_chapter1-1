// 토스트 UI 컴포넌트
// 사용: import { showToast } from "../components/toast";
// showToast("장바구니에 추가되었습니다");

export type ToastVariant = "success" | "error" | "info";

const variantClasses: Record<ToastVariant, string> = {
  success: "bg-green-600",
  error: "bg-red-600",
  info: "bg-blue-600",
};

export function 토스트(message: string, variant: ToastVariant = "success", duration = 2000) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className =
      "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center justify-center mx-auto";
    const rootEl = document.getElementById("root") ?? document.body;
    rootEl.appendChild(container);
  }

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="${variantClasses[variant]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
      <div class="flex-shrink-0">
        ${variant === "success" ? successIcon() : variant === "error" ? errorIcon() : infoIcon()}
      </div>
      <p class="text-sm font-medium">${message}</p>
      <button class="flex-shrink-0 ml-2 text-white hover:text-gray-200 toast-close-btn" aria-label="close toast">
        ${closeIcon()}
      </button>
    </div>`;

  const toastEl = wrapper.firstElementChild as HTMLElement;
  container.appendChild(toastEl);

  const closeBtn = toastEl.querySelector(".toast-close-btn") as HTMLButtonElement | null;
  const remove = () => toastEl.remove();
  closeBtn?.addEventListener("click", remove);
  setTimeout(remove, duration);
}

function successIcon() {
  return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`;
}
function errorIcon() {
  return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`;
}
function infoIcon() {
  return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
}
function closeIcon() {
  return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`;
}
