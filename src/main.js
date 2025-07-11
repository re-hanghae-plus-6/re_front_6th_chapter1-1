import router from "./router.js";
import Toast from "./components/Toast.js";

// 앱 초기화 함수
function initializeApp() {
  router.init();

  // Toast 컴포넌트 초기화
  const toast = new Toast();
  toast.mounted();
}

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker, workerOptions }) => worker.start(workerOptions));

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(() => {
    initializeApp();
  });
} else {
  // 테스트 환경에서는 즉시 초기화
  initializeApp();
}
