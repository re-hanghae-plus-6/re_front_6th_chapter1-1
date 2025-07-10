import Footer from "./shared/ui/footer/index.js";
import Header from "./components/Header";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

function main() {
  document.body.innerHTML = `
  <div class="bg-gray-50">
    ${Header}
    ${Footer}
  </div>
  `;
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
