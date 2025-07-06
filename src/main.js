import Header from "./components/layout/Header.js";
import Footer from "./components/layout/Footer.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

function main() {
  document.body.innerHTML = /*html*/ `
    ${Header(0, false)}
    <main>
      <h1>안녕하세요</h1>
    </main>
    ${Footer()}
  `;
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
