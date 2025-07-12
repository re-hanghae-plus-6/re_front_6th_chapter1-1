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
  import("./mocks/browser.js").then(({ worker, workerOptions }) => {
    // GitHub Pages 환경에서는 base path를 설정
    if (import.meta.env.PROD) {
      workerOptions.serviceWorker.options = {
        scope: "/front_6th_chapter1-1/",
      };
    }
    return worker.start(workerOptions);
  });

// 애플리케이션 시작
enableMocking().then(() => {
  initializeApp();
});
