import { initializeRouter } from "./utils/router.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: "/front_6th_chapter1-1/mockServiceWorker.js",
      },
    }),
  );

class App {
  constructor() {
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      await initializeRouter();

      this.isInitialized = true;
    } catch (error) {
      console.error("애플리케이션 초기화 실패:", error);
    }
  }

  async restart() {
    this.isInitialized = false;
    await this.initialize();
  }
}

const app = new App();

async function main() {
  await app.initialize();
}

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  app.restart();
}

export { app };
