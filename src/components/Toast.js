// 토스트 메시지 표시
export const showToast = (message) => {
  // 기존 토스트 제거
  const existingToast = document.getElementById("toast-message");
  if (existingToast) {
    existingToast.remove();
  }

  // 토스트 요소 생성
  const toast = document.createElement("div");
  toast.id = "toast-message";
  toast.className =
    "fixed bottom-4 right-12 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full";
  toast.textContent = message;

  // body에 추가
  document.body.appendChild(toast);

  // 애니메이션 효과
  setTimeout(() => {
    toast.classList.remove("translate-x-full");
  }, 100);

  // 3초 후 제거
  setTimeout(() => {
    toast.classList.add("translate-x-full");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
};
