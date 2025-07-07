import footer from "./components/Footer.js";
import Header from "./components/header.js";
import HomeView from "./views/HomeView.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

function main() {
  const home = new HomeView();
  const header = new Header();

  // TODO :: 렌더링 로직 따로 분리하기
  const render = (html) => {
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = html;
    } else {
      const createRootElement = document.createElement("div");
      createRootElement.id = "root";
      createRootElement.innerHTML = html;
      document.body.appendChild(createRootElement);
    }
  };

  render(/* html */ `
    <div class="min-h-screen bg-gray-50 relative">
      <header class="bg-white shadow-sm sticky top-0 z-40"></header>
      <main class="max-w-md mx-auto px-4 py-4"></main>
      <div id="scroll-observer" class="h-4 w-4 absolute bottom-0 left-0"></div>
      ${footer}
    </div> 
  `);

  header.mount(document.querySelector("header"));
  home.mount();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
