import { router, initializeRoutes } from "../routes/index.js";
import { setupAppListeners } from "../utils/index.js";
import { setupProductListEventListeners, setupScrollEventListener } from "../utils/index.js";

/**
 * 모킹 활성화
 */
const enableMocking = () =>
  import("../mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

/**
 * 메인 애플리케이션 클래스
 */
export class App {
  /**
   * 애플리케이션 초기화
   */
  async init() {
    // 개발 환경에서만 모킹 활성화
    if (import.meta.env.MODE !== "test") {
      await enableMocking();
    }

    // 앱 초기화
    await this.initialize();
  }

  /**
   * 앱 초기화 실행
   */
  async initialize() {
    // 1. 라우트 설정
    this.setupRoutes();

    // 2. 리스너들 설정
    this.setupListeners();

    // 3. 이벤트 핸들러들 설정
    this.setupEventHandlers();

    // 4. 라우터 시작
    this.startRouter();
  }

  /**
   * 라우트 설정
   */
  setupRoutes() {
    initializeRoutes(router);
  }

  /**
   * 리스너들 설정
   */
  setupListeners() {
    setupAppListeners();
  }

  /**
   * 이벤트 핸들러들 설정
   */
  setupEventHandlers() {
    setupProductListEventListeners();
    setupScrollEventListener();
  }

  /**
   * 라우터 시작
   */
  startRouter() {
    router.handleRouteChange();
  }
}

// 전역 앱 인스턴스
export const app = new App();
