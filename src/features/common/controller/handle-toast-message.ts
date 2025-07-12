import { createStore } from "../../../store/create-store";
import { 토스트 } from "../components/토스트";

export type ToastType = "success" | "info" | "error";

export type ToastStoreState = {
  text: string;
  type: ToastType;
  duration?: number;
};
export const toastStore = createStore<ToastStoreState | null>(null);

let toastTimeout: ReturnType<typeof setTimeout> | null = null;

function handleToastMessage(args: ToastStoreState) {
  const toastInstance = document.getElementById("toast-component");

  if (toastInstance) {
    toastInstance.remove();
  }

  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toastTimeout = null;
  }

  toastStore.setValue(args);

  // 토스트 컴포넌트 생성 및 DOM에 mount
  const 토스트_컴포넌트 = new 토스트({
    type: args.type,
    message: args.text,
  });

  const toastEl = document.createElement("div");
  toastEl.style.position = "absolute";
  toastEl.style.left = "50%";
  toastEl.style.bottom = "32px";
  toastEl.style.transform = "translateX(-50%)";
  toastEl.style.zIndex = "9999";

  document.body.appendChild(toastEl);

  토스트_컴포넌트.mount(toastEl);

  const duration = args.duration ?? 3000;

  toastTimeout = setTimeout(() => {
    toastStore.setValue(null);
    const toastInstance = document.getElementById("toast-component");

    if (toastInstance) {
      토스트_컴포넌트.unmount();
      toastInstance.remove();
    }
  }, duration);
}

export { handleToastMessage };
