import { renderHtml } from "../../utils/renderHtml";

window.toastState = {
  type: null,
  message: null,
  timeoutId: null,
};

export const showToast = (type = "success", message = "알림") => {
  window.toastState.type = type;
  window.toastState.message = message;
  // 2초 후 자동 삭제
  if (window.toastState.timeoutId) clearTimeout(window.toastState.timeoutId);
  window.toastState.timeoutId = setTimeout(() => {
    window.toastState.type = null;
    window.toastState.message = null;
    renderHtml(); // 토스트 사라지게 다시 렌더
  }, 2000);
  renderHtml(); // 토스트 보이게 다시 렌더
};
