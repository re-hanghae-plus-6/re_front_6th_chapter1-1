import Layout from "./components/Layout.js";
import useNavigate from "./core/useNavigate.js";
import useRender from "./core/useRender.js";
import useStore from "./core/useStore.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker, workerOptions }) => worker.start(workerOptions));

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}

export const render = useRender();
export const navigate = useNavigate();
export const store = useStore();
export const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

// BASE_PATH를 제거한 앱 경로를 반환하는 유틸리티 함수
export const getAppPath = (fullPath = window.location.pathname) => {
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
};

export const getFullPath = (appPath) => {
  return BASE_PATH + appPath;
};

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
