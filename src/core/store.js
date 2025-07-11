/**
 * 전역 상태 관리를 위한 스토어 클래스
 * Pub-Sub 패턴을 사용하여 상태 변경 시 구독자들에게 알림
 */
class Store {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.subscribers = new Map(); // 구독자들을 저장하는 Map
    this.middlewares = []; // 미들웨어들을 저장하는 배열
  }

  /**
   * 현재 상태를 반환
   * @returns {Object} 현재 상태
   */
  getState() {
    return { ...this.state };
  }

  /**
   * 특정 키의 상태 값을 반환
   * @param {string} key - 상태 키
   * @returns {*} 상태 값
   */
  getStateByKey(key) {
    return this.state[key];
  }

  /**
   * 상태를 업데이트하고 구독자들에게 알림
   * @param {string} key - 상태 키
   * @param {*} value - 새로운 값
   * @param {string} action - 액션 타입 (선택사항)
   */
  setState(key, value, action = "UPDATE") {
    const prevState = { ...this.state };
    const prevValue = this.state[key];

    // 미들웨어 실행 (상태 변경 전)
    this.runMiddlewares("BEFORE_SET", { key, value, prevValue, action });

    // 상태 업데이트
    this.state[key] = value;

    // 미들웨어 실행 (상태 변경 후)
    this.runMiddlewares("AFTER_SET", { key, value, prevValue, action });

    // 구독자들에게 알림
    this.notify(key, value, prevValue, action);

    // 전역 상태 변경 알림
    this.notifyGlobal(this.state, prevState, action);
  }

  /**
   * 여러 상태를 한번에 업데이트
   * @param {Object} updates - 업데이트할 상태 객체
   * @param {string} action - 액션 타입
   */
  setStates(updates, action = "BATCH_UPDATE") {
    const prevState = { ...this.state };

    // 미들웨어 실행 (상태 변경 전)
    this.runMiddlewares("BEFORE_BATCH_SET", { updates, prevState, action });

    // 상태 업데이트
    Object.entries(updates).forEach(([key, value]) => {
      this.state[key] = value;
    });

    // 미들웨어 실행 (상태 변경 후)
    this.runMiddlewares("AFTER_BATCH_SET", { updates, prevState, action });

    // 개별 구독자들에게 알림
    Object.entries(updates).forEach(([key, value]) => {
      this.notify(key, value, prevState[key], action);
    });

    // 전역 상태 변경 알림
    this.notifyGlobal(this.state, prevState, action);
  }

  /**
   * 특정 상태 키에 대한 구독자 추가
   * @param {string} key - 상태 키
   * @param {Function} callback - 콜백 함수
   * @returns {Function} 구독 해제 함수
   */
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }

    this.subscribers.get(key).add(callback);

    // 구독 해제 함수 반환
    return () => {
      this.unsubscribe(key, callback);
    };
  }

  /**
   * 전역 상태 변경에 대한 구독자 추가
   * @param {Function} callback - 콜백 함수
   * @returns {Function} 구독 해제 함수
   */
  subscribeGlobal(callback) {
    return this.subscribe("__GLOBAL__", callback);
  }

  /**
   * 구독 해제
   * @param {string} key - 상태 키
   * @param {Function} callback - 콜백 함수
   */
  unsubscribe(key, callback) {
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).delete(callback);

      // 구독자가 없으면 키 제거
      if (this.subscribers.get(key).size === 0) {
        this.subscribers.delete(key);
      }
    }
  }

  /**
   * 특정 키의 모든 구독자 해제
   * @param {string} key - 상태 키
   */
  unsubscribeAll(key) {
    this.subscribers.delete(key);
  }

  /**
   * 모든 구독자 해제
   */
  clearSubscribers() {
    this.subscribers.clear();
  }

  /**
   * 특정 키의 구독자들에게 알림
   * @param {string} key - 상태 키
   * @param {*} value - 새로운 값
   * @param {*} prevValue - 이전 값
   * @param {string} action - 액션 타입
   */
  notify(key, value, prevValue, action) {
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).forEach((callback) => {
        try {
          callback(value, prevValue, action);
        } catch (error) {
          console.error(`구독자 콜백 실행 중 오류 발생:`, error);
        }
      });
    }
  }

  /**
   * 전역 상태 변경 구독자들에게 알림
   * @param {Object} state - 현재 상태
   * @param {Object} prevState - 이전 상태
   * @param {string} action - 액션 타입
   */
  notifyGlobal(state, prevState, action) {
    if (this.subscribers.has("__GLOBAL__")) {
      this.subscribers.get("__GLOBAL__").forEach((callback) => {
        try {
          callback(state, prevState, action);
        } catch (error) {
          console.error(`전역 구독자 콜백 실행 중 오류 발생:`, error);
        }
      });
    }
  }

  /**
   * 미들웨어 추가
   * @param {Function} middleware - 미들웨어 함수
   */
  addMiddleware(middleware) {
    this.middlewares.push(middleware);
  }

  /**
   * 미들웨어 실행
   * @param {string} phase - 실행 단계
   * @param {Object} context - 컨텍스트 정보
   */
  runMiddlewares(phase, context) {
    this.middlewares.forEach((middleware) => {
      try {
        middleware(phase, context, this);
      } catch (error) {
        console.error(`미들웨어 실행 중 오류 발생:`, error);
      }
    });
  }

  /**
   * 디버깅용 정보 출력
   */
  debug() {
    console.log("=== Store Debug Info ===");
    console.log("State:", this.state);
    console.log("Subscribers:", Array.from(this.subscribers.keys()));
    console.log("Middlewares:", this.middlewares.length);
    console.log("========================");
  }
}

/**
 * 전역 스토어 인스턴스 생성
 */
const globalStore = new Store();

/**
 * 로깅 미들웨어
 */
const loggingMiddleware = (phase, context) => {
  if (phase === "AFTER_SET" || phase === "AFTER_BATCH_SET") {
    console.log(`[Store] ${context.action}:`, {
      key: context.key || "batch",
      value: context.value || context.updates,
      prevValue: context.prevValue || context.prevState,
    });
  }
};

// 개발 환경에서만 로깅 미들웨어 추가
if (process.env.NODE_ENV === "development") {
  globalStore.addMiddleware(loggingMiddleware);
}

export { Store, globalStore };
export default globalStore;
