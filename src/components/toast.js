import BaseComponent from "@/core/component";

export default class Toast extends BaseComponent {
  constructor(target, props) {
    super(target, props);
    this.timeoutId = null;
  }

  initialState() {
    this.state = {
      isVisible: false,
      type: "success", // success, info, error
      message: "",
    };
    super.initialState();
  }

  componentDidMount() {
    this.initializeEventHandlers();
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  initializeEventHandlers() {
    this.target.addEventListener("click", (event) => {
      if (event.target.closest("#toast-close-btn")) {
        this.hide();
      }
    });
  }

  show(type = "success", message = "", duration = 3000) {
    this.setState({
      isVisible: true,
      type,
      message,
    });

    // 자동으로 숨기기
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.hide();
    }, duration);
  }

  hide() {
    this.setState({
      isVisible: false,
    });

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  getToastConfig() {
    const configs = {
      success: {
        bgColor: "bg-green-600",
        icon: /* html */ `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        `,
      },
      info: {
        bgColor: "bg-blue-600",
        icon: /* html */ `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        `,
      },
      error: {
        bgColor: "bg-red-600",
        icon: /* html */ `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        `,
      },
    };

    return configs[this.state.type] || configs.success;
  }

  template() {
    if (!this.state.isVisible) {
      return "";
    }

    const config = this.getToastConfig();

    return /* html */ `
      <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[100] animate-slide-up">
        <div class="${config.bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
          <div class="flex-shrink-0">
            ${config.icon}
          </div>
          <p class="text-sm font-medium">${this.state.message}</p>
          <button 
            id="toast-close-btn" 
            class="flex-shrink-0 ml-2 text-white hover:text-gray-200 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    `;
  }
}
