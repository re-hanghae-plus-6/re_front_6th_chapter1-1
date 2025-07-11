import { getFullPath } from "../utils/path.js";

// 홈으로 돌아가기 핸들러
export const handleGoHome = () => {
  // URL을 홈으로 변경 (BASE_PATH 고려)
  const homePath = getFullPath("/");
  window.history.pushState({}, "", homePath);

  // 홈 페이지로 이동
  window.location.reload();
};

// 이전 페이지로 돌아가기 핸들러
export const handleGoBack = () => {
  // 브라우저 히스토리가 있으면 뒤로가기
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // 히스토리가 없으면 홈으로 이동
    handleGoHome();
  }
};

// 404 페이지 이벤트 리스너 설정
export const setupNotFoundEventListeners = () => {
  // 홈으로 돌아가기 버튼
  const goHomeBtn = document.getElementById("go-home-btn");
  if (goHomeBtn) {
    goHomeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleGoHome();
    });
  }
};
