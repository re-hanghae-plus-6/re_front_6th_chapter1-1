// MSW 설정
export const enableMocking = () =>
  import("../mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

// 앱 초기화
export function initializeApp(main) {
  if (import.meta.env.MODE !== "test") {
    return enableMocking().then(() => {
      main();
    });
  } else {
    // 테스트 환경에서는 바로 시작
    main();
  }
}
