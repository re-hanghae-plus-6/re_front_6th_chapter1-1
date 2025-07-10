import { storeManager } from "./stores/index.js";
import { initRender, render } from "./render.js";

// MSW 초기화 상태 관리
let mswReady = false;
const mswReadyPromise = new Promise((resolve) => {
  window.mswResolve = resolve;
});

const enableMocking = async () => {
  try {
    const { worker } = await import("./mocks/browser.js");
    await worker.start({
      onUnhandledRequest: "bypass",
    });
    mswReady = true;
    window.mswResolve && window.mswResolve();
    return true;
  } catch (error) {
    console.error("MSW 초기화 실패:", error);
    return false;
  }
};

// MSW 준비 상태 확인 함수
export function isMSWReady() {
  return mswReady;
}

// MSW 준비까지 기다리는 함수
export function waitForMSW() {
  if (mswReady) {
    return Promise.resolve();
  }
  return mswReadyPromise;
}

// 앱 시작
async function startApp() {
  // MSW 초기화 (테스트 환경이 아닌 경우)
  if (import.meta.env.MODE !== "test") {
    await enableMocking();
  } else {
    // 테스트 환경에서는 MSW 준비 상태로 설정
    mswReady = true;
    window.mswResolve && window.mswResolve();
  }

  // 렌더링 시스템 초기화
  initRender();

  // store 매니저를 통한 앱 초기화
  await storeManager.initialize();

  // 초기 렌더링
  render();

  // popstate 이벤트 리스너 추가 (브라우저 뒤로가기/앞으로가기 및 테스트에서 사용)
  window.addEventListener("popstate", async () => {
    // 스크롤 이벤트 리스너 초기화
    window.scrollHandlerAdded = false;

    // store 매니저를 통한 재초기화
    await storeManager.initialize();

    // 다시 렌더링
    render();
  });
}

startApp();
