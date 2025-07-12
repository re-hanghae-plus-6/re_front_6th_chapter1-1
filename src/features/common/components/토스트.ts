import { Component } from "../../../../componet";

import { ToastType } from "../controller/handle-toast-message";

interface ToastProps {
  type: ToastType;
  message: string;
}

// Toast 컴포넌트
// ToastStore 반드시 사용해야함
export class 토스트 extends Component<ToastProps> {
  subscribeStoreList: Array<() => void> = [];

  render(): HTMLElement {
    const { type = "success", message = "", duration = 3000 } = this.props;

    let bgColor = "bg-green-600";
    let icon = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
    `;
    if (type === "info") {
      bgColor = "bg-blue-600";
      icon = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      `;
    }
    if (type === "error") {
      bgColor = "bg-red-600";
      icon = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      `;
    }

    const wrapper = document.createElement("div");
    wrapper.id = "toast-component";
    wrapper.className = "flex flex-col gap-2 items-center justify-center mx-auto";
    wrapper.style.width = "fit-content";

    const toastDiv = document.createElement("div");
    toastDiv.className = `${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm`;

    const iconDiv = document.createElement("div");
    iconDiv.className = "flex-shrink-0";
    iconDiv.innerHTML = icon;

    const msgP = document.createElement("p");
    msgP.className = "text-sm font-medium";
    msgP.textContent = message;

    const closeBtn = document.createElement("button");
    closeBtn.className = "flex-shrink-0 ml-2 text-white hover:text-gray-200";
    closeBtn.innerHTML = `
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    `;
    closeBtn.onclick = () => {
      this.unmount();
      // this.props.onClose?.();
    };

    toastDiv.appendChild(iconDiv);
    toastDiv.appendChild(msgP);
    toastDiv.appendChild(closeBtn);

    wrapper.appendChild(toastDiv);

    return wrapper;
  }
}
