import router from "./router.js";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";

class Main {
  constructor() {
    this.header = new Header();
    this.footer = new Footer();

    this.initializePage();
    router.init();
  }

  initializePage() {
    const root = /*html*/ `
      <div class="min-h-screen bg-gray-50">
        ${this.header.render()}
        <main id="page-content" class="max-w-md mx-auto px-4 py-4"></main>
        ${this.footer.render()}
      </div>
    `;
    document.getElementById("root").innerHTML = root;
  }
}

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(() => {
    new Main();
  });
} else {
  new Main();
}
