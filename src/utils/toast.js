export const openToast = ({ message }) => {
  const successToast = document.querySelector("#success-toast");
  const toastMessage = document.querySelector("#toast-message");

  toastMessage.textContent = message;

  if (successToast) {
    successToast.classList.remove("opacity-0");
    successToast.classList.add("opacity-100");

    setTimeout(() => {
      successToast.classList.remove("opacity-100");
      successToast.classList.add("opacity-0");
    }, 3000);
  }
};
