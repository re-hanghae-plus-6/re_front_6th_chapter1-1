import CreateStore from '../core/CreateStore.js';

const toastStore = new CreateStore({
  isOpen: false,
  type: 'success', // success | info | error
  message: '',
});
export default toastStore;

export function openToast({ message, type = 'info', duration = 3000 }) {
  toastStore.setState({
    isOpen: true,
    type,
    message,
  });

  // 자동 닫힘
  if (duration > 0) {
    setTimeout(() => {
      closeToast();
    }, duration);
  }
}

export function closeToast() {
  toastStore.setState({ isOpen: false });
}

export function toastSuccess(message, duration) {
  openToast({ message, type: 'success', duration });
}
export function toastError(message, duration) {
  openToast({ message, type: 'error', duration });
}
export function toastInfo(message, duration) {
  openToast({ message, type: 'info', duration });
}
