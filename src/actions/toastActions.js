export const TOAST_ACTIONS = {
  SHOW_TOAST: "SHOW_TOAST",
  HIDE_TOAST: "HIDE_TOAST",
};

export const toastActions = {
  showToast: (message, toastType = "success") => ({
    type: TOAST_ACTIONS.SHOW_TOAST,
    payload: { toastType, message },
  }),
  hideToast: () => ({
    type: TOAST_ACTIONS.HIDE_TOAST,
  }),
};
