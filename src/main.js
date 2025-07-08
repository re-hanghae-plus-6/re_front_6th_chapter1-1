import router from "./router.js";

// 앱 초기화 함수
function initializeApp() {
  router.init();
}

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(() => {
    initializeApp();
  });
} else {
  // 테스트 환경에서는 즉시 초기화
  initializeApp();
}
