import Layout from "./components/Layout.js";
import useRender from "./core/useRender.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

const render = useRender();

function main() {
  // #root Element에 Layout HTML 삽입
  render.draw("#root", Layout());

  // Page에 init, mount 실행
  render.view();

  // Layout 컴포넌트 마운트
  Layout.mount?.();

  window.addEventListener("urlChange", (event) => {
    if (event.detail.isUrlChange) {
      render.view();
    }
  });
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
