import { storeManager } from "./stores/index.js";
import { initRender, render } from "./render.js";

// MSW 활성화 함수
const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker, workerOptions }) => worker.start(workerOptions));

// 메인 앱 초기화 함수
async function initializeApp() {
  try {
    // 렌더링 시스템 초기화
    initRender();

    // store 매니저를 통한 앱 초기화
    await storeManager.initialize();

    // 초기 렌더링
    render();

    // popstate 이벤트 리스너 추가 (브라우저 뒤로가기/앞으로가기)
    window.addEventListener("popstate", async () => {
      // 스크롤 이벤트 리스너 초기화
      window.scrollHandlerAdded = false;

      // store 매니저를 통한 재초기화
      await storeManager.initialize();

      // 다시 렌더링
      render();
    });
  } catch (error) {
    console.error("❌ App initialization error:", error);
  }
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(initializeApp);
} else {
  initializeApp();
}
