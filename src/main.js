import Layout from "./components/Layout.js";
import useNavigate from "./core/useNavigate.js";
import useRender from "./core/useRender.js";
import useStore from "./core/useStore.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      },
    }),
  );

export const render = useRender();
export const navigate = useNavigate();
export const store = useStore();

function main() {
  // #root Element에 Layout HTML 삽입
  render.init();

  // Page에 init, mount 실행
  render.view();

  // Layout 컴포넌트 마운트
  Layout.mount?.();

  window.addEventListener("popstate", () => {
    render.init();
    Layout.mount?.();
    render.view();
  });
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
