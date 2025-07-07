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

  document.body.innerHTML = /* html */ `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm sticky top-0 z-40"></header>
      <main class="max-w-md mx-auto px-4 py-4"></main>
      ${footer}
    </div> 
  `;
  header.mount(document.querySelector("header"));
  home.mount();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
