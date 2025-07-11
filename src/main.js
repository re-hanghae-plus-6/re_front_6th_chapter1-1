import Footer from "./shared/ui/footer";
import Header from "./components/Header";
import { ListPageController, updateListPageUI, createListPageContainer } from "./pages/ListPage";

const enableMocking = () => {
  return import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );
};

function render() {
  document.body.querySelector("#root").innerHTML = `
  <div class="bg-gray-50">
    ${Header}
    ${createListPageContainer()}
    ${Footer}
  </div>
  `;
}

async function main() {
  // 1. 초기 렌더링 (빈 컨테이너 생성)
  render();

  // 2. 컨트롤러 생성 및 데이터 로드
  const controller = new ListPageController();
  await controller.loadData((state) => {
    // 3. 상태 변경 시마다 UI 업데이트 (controller도 함께 전달)
    updateListPageUI(state, controller);
  });
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
