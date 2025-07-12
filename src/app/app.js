import { router, initializeRoutes } from "../routes/index.js";
import { setupAppListeners } from "../utils/index.js";
import { setupProductListEventListeners, setupScrollEventListener } from "../utils/index.js";
import { cartService } from "../services/index.js";

/**
 * 모킹 활성화
 */
const enableMocking = () =>
  import("../mocks/browser.js").then(({ worker, workerOptions }) => worker.start(workerOptions));

/**
 * 메인 애플리케이션 클래스
 */
export class App {
  async init() {
    if (import.meta.env.MODE !== "test") {
      await enableMocking();
    }
    await this.initialize();
  }

  async initialize() {
    // 1. 라우트 설정
    this.setupRoutes();

    // 2. 서비스 초기화
    this.initializeServices();

    // 3. 리스너들 설정
    this.setupListeners();

    // 4. 이벤트 핸들러들 설정
    this.setupEventHandlers();

    // 5. 라우터 시작
    this.startRouter();
  }

  setupRoutes() {
    initializeRoutes(router);
  }

  initializeServices() {
    cartService.loadCartFromStorage();
  }

  setupListeners() {
    setupAppListeners();
  }

  setupEventHandlers() {
    setupProductListEventListeners();
    setupScrollEventListener();
  }

  startRouter() {
    router.handleRouteChange();
  }
}

export const app = new App();
