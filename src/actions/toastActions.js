export const TOAST_ACTIONS = {
  SHOW_TOAST: "SHOW_TOAST",
  HIDE_TOAST: "HIDE_TOAST",
};

export const toastActions = {
  showToast:
    (message, toastType = "success") =>
    (dispatch) => {
      dispatch({
        type: TOAST_ACTIONS.SHOW_TOAST,
        payload: { toastType, message },
      });

      setTimeout(() => {
        dispatch({
          type: TOAST_ACTIONS.HIDE_TOAST,
        });
      }, 3000);
    },
  hideToast: () => ({
    type: TOAST_ACTIONS.HIDE_TOAST,
  }),
};
