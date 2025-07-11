import Component from '../../../core/Component.js';
import toastStore, { closeToast } from '../../../store/toastStore.js';

const TOAST_TYPE_MAP = {
  success: {
    bg: 'bg-green-600',
    icon: /* HTML */ ` <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5 13l4 4L19 7"
      ></path>
    </svg>`,
  },
  info: {
    bg: 'bg-blue-600',
    icon: /* HTML */ ` <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>`,
  },
  error: {
    bg: 'bg-red-600',
    icon: /* HTML */ `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>`,
  },
};

class Toast extends Component {
  constructor(element, props) {
    super(element, props);
  }

  attachEventListeners() {
    this.addEventListener(this.element, 'click', (event) => {
      const state = toastStore.getState();
      const toastCloseBtn = event.target.closest('#toast-close-btn');
      if (toastCloseBtn && state.isOpen) {
        closeToast();
      }
    });
  }

  renderToast(type, message) {
    const { bg, icon } = TOAST_TYPE_MAP[type] || TOAST_TYPE_MAP['info'];

    return /* HTML */ `
      <div
        class="${bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm"
      >
        <div class="flex-shrink-0">${icon}</div>
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
      </div>
    `;
  }

  render() {
    const { type, message } = toastStore.getState();

    this.element.innerHTML = /* HTML */ `<div
      class="fixed bottom-[40px] left-1/2 -translate-x-1/2 "
    >
      ${this.renderToast(type, message)}
    </div>`;
  }
}

export default Toast;
