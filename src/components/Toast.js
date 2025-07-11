// Toast 레이아웃 컴포넌트
export const ToastLayout = (children) => {
  return /* HTML */ `
    <div class="flex flex-col gap-2 items-center justify-center mx-auto" style="width: fit-content;">${children}</div>
  `;
};

// 공통 Toast 아이콘 컴포넌트들
const SuccessIcon = () => `
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
  </svg>
`;

const InfoIcon = () => `
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
`;

const ErrorIcon = () => `
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
`;

const CloseButton = () => `
  <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  </button>
`;

// 공통 Toast 구조를 만드는 헬퍼 함수
const createToast = (bgColor, icon, message) => `
  <div class="${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
    <div class="flex-shrink-0">
      ${icon}
    </div>
    <p class="text-sm font-medium">${message}</p>
    ${CloseButton()}
  </div>
`;

/**
 * 장바구니 추가 성공시 발생하는 토스트 컴포넌트
 */
export const SuccessToast = () => {
  return /* HTML */ ` ${ToastLayout(createToast("bg-green-600", SuccessIcon(), "장바구니에 추가되었습니다"))} `;
};

/**
 * 장바구니 담는 과정에서 살패시 발생하는 토스트 컴포넌트
 */
export const DeleteToast = () => {
  return /* HTML */ ` ${ToastLayout(createToast("bg-blue-600", InfoIcon(), "선택된 상품들이 삭제되었습니다"))} `;
};

/**
 * 장바구니 담는 과정에서 에러 발생하는 토스트 컴포넌트
 */
export const ErrorToast = () => {
  return /* HTML */ ` ${ToastLayout(createToast("bg-red-600", ErrorIcon(), "오류가 발생했습니다."))} `;
};
