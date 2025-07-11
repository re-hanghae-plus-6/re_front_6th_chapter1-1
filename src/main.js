import { storeManager } from "./stores/index.js";
import { initRender, render } from "./render.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker, workerOptions }) => worker.start(workerOptions));

// GitHub Pages SPA 리다이렉트 처리
function handleGitHubPagesRedirect() {
  // GitHub Pages에서 404.html을 통해 리다이렉트된 경우 처리
  const query = window.location.search;
  if (query.startsWith("/?/")) {
    const path = query.slice(2).replace(/~and~/g, "&");
    if (path) {
      // 원래 경로로 리다이렉트
      window.history.replaceState({}, "", path);
    }
  }
}

// 메인 앱 함수
async function main() {
  // GitHub Pages 리다이렉트 처리 (앱 시작 전)
  handleGitHubPagesRedirect();

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

// 앱 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
