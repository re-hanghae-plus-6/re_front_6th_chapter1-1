export const openToast = ({ message, type = "success" }) => {
  const successToast = document.querySelector("#success-toast");
  const errorToast = document.querySelector("#error-toast");
  const infoToast = document.querySelector("#info-toast");
  const toastMessage = document.querySelector("#toast-message");

  toastMessage.textContent = message;
  if (type === "success") {
    successToast.classList.remove("opacity-0");
    successToast.classList.add("opacity-100");

    setTimeout(() => {
      successToast.classList.remove("opacity-100");
      successToast.classList.add("opacity-0");
    }, 3000);
  } else if (type === "error") {
    errorToast.classList.remove("opacity-0");
    errorToast.classList.add("opacity-100");

    setTimeout(() => {
      errorToast.classList.remove("opacity-100");
      errorToast.classList.add("opacity-0");
    }, 3000);
  } else if (type === "info") {
    infoToast.classList.remove("opacity-0");
    infoToast.classList.add("opacity-100");

    setTimeout(() => {
      infoToast.classList.remove("opacity-100");
      infoToast.classList.add("opacity-0");
    }, 3000);
  }
};
