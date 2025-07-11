// mock 설정
async function enableMocking() {
  try {
    const { worker, workerOptions } = await import("../mocks/browser.js");
    await worker.start(workerOptions);
    console.info("[MSW] Mock service worker started");
  } catch (error) {
    console.warn("[MSW] Failed to start mock service worker", error);
  }
}
// 앱 초기화
export async function initializeApp(main) {
  const isTestEnv = import.meta.env.MODE === "test";

  if (!isTestEnv) {
    await enableMocking();
  }

  main(); // 항상 실행
}
