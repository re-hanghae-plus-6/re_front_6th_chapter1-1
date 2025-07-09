export function Toast({ id, message, type = 'success' }) {
  const getToastStyle = (type) => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-600',
          icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>`,
        };
      case 'info':
        return {
          bgColor: 'bg-blue-600',
          icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
        };
      case 'error':
        return {
          bgColor: 'bg-red-600',
          icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>`,
        };
      default:
        return {
          bgColor: 'bg-green-600',
          icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>`,
        };
    }
  };

  const { bgColor, icon } = getToastStyle(type);

  return `
    <div id="toast-${id}" class="fixed left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out translate-y-full opacity-0" data-toast-id="${id}">
      <div class="${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm mx-auto">
        <div class="flex-shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${icon}
          </svg>
        </div>
        <p class="text-sm font-medium flex-1">${message}</p>
        <button class="toast-close-btn flex-shrink-0 ml-2 text-white hover:text-gray-200 transition-colors" data-toast-id="${id}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  `;
}

export class ToastManager {
  constructor() {
    this.toasts = new Map(); // 키: toastId, 값: {element, timeout, order}
    this.nextId = 1;
    this.maxToasts = 3; // 최대 토스트 개수
    this.toastHeight = 60; // 토스트 간격 (기존의 1/3로 축소)
    this.setupGlobalEventListener();
  }

  generateId() {
    return `toast_${this.nextId++}_${Date.now()}`;
  }

  setupGlobalEventListener() {
    // 전역 이벤트 위임으로 X 버튼 클릭 처리
    document.addEventListener('click', (e) => {
      if (
        e.target.matches('.toast-close-btn') ||
        e.target.closest('.toast-close-btn')
      ) {
        const closeBtn = e.target.matches('.toast-close-btn')
          ? e.target
          : e.target.closest('.toast-close-btn');
        const toastId = closeBtn.dataset.toastId;
        if (toastId) {
          this.hide(toastId);
        }
      }
    });
  }

  show(message, type = 'success', duration = 2000) {
    const toastId = this.generateId();

    // 3개 초과 시 가장 오래된 토스트 제거
    if (this.toasts.size >= this.maxToasts) {
      this.removeOldestToast();
    }

    // 현재 토스트들의 위치 계산
    const currentIndex = this.toasts.size;
    const bottomPosition = 16 + currentIndex * this.toastHeight; // 16px 기본 여백

    // 새 토스트 생성
    const toastContainer = document.createElement('div');
    toastContainer.innerHTML = Toast({ id: toastId, message, type });

    const toastElement = toastContainer.firstElementChild;
    // 초기 위치 설정 (아래에서 시작)
    toastElement.style.bottom = `${bottomPosition}px`;
    toastElement.style.transform = 'translate(-50%, 100%)';

    document.body.appendChild(toastElement);

    // 애니메이션을 위한 약간의 지연
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // 위로 올라오는 애니메이션
        toastElement.style.transform = 'translate(-50%, 0)';
        toastElement.style.opacity = '1';
      });
    });

    // 자동 숨김 타이머 설정
    const timeout = setTimeout(() => {
      this.hide(toastId);
    }, duration);

    // 토스트 정보 저장
    this.toasts.set(toastId, {
      element: toastElement,
      timeout: timeout,
      order: Date.now(), // 생성 순서 추적
    });

    return toastId;
  }

  removeOldestToast() {
    // 가장 오래된 토스트 찾기
    let oldestId = null;
    let oldestOrder = Infinity;

    this.toasts.forEach((toastData, toastId) => {
      if (toastData.order < oldestOrder) {
        oldestOrder = toastData.order;
        oldestId = toastId;
      }
    });

    if (oldestId) {
      this.hide(oldestId);
    }
  }

  hide(toastId) {
    const toastData = this.toasts.get(toastId);
    if (!toastData) return;

    const { element, timeout } = toastData;

    // 타이머 정리
    if (timeout) {
      clearTimeout(timeout);
    }

    // 아래로 사라지는 애니메이션
    element.style.transform = 'translate(-50%, 100%)';
    element.style.opacity = '0';

    // 애니메이션 완료 후 DOM에서 제거 및 위치 재정렬
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      this.toasts.delete(toastId);
      // 남은 토스트들의 위치 재정렬
      this.repositionToasts();
    }, 300);
  }

  repositionToasts() {
    // 생성 순서에 따라 토스트들을 정렬
    const sortedToasts = Array.from(this.toasts.entries()).sort(
      ([, a], [, b]) => a.order - b.order,
    );

    // 각 토스트의 위치를 다시 계산하여 설정
    sortedToasts.forEach(([, toastData], index) => {
      const bottomPosition = 16 + index * this.toastHeight;
      toastData.element.style.bottom = `${bottomPosition}px`;
    });
  }

  hideAllImmediately() {
    // 모든 기존 토스트를 애니메이션 없이 즉시 제거
    this.toasts.forEach((toastData) => {
      const { element, timeout } = toastData;

      // 타이머 정리
      if (timeout) {
        clearTimeout(timeout);
      }

      // DOM에서 즉시 제거
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });

    // 토스트 맵 초기화
    this.toasts.clear();
  }

  hideAll() {
    // 모든 토스트를 애니메이션과 함께 제거
    this.toasts.forEach((_, toastId) => {
      this.hide(toastId);
    });
  }
}
