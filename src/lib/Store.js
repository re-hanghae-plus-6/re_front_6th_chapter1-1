// store.js
export default class Store {
  static #instance;

  #state;
  #observers;

  constructor(initialState) {
    if (Store.#instance) {
      return Store.#instance; // 이미 있으면 그거 반환
    }

    this.#state = { ...initialState };
    this.#observers = new Set();

    Store.#instance = this; // 최초 생성된 인스턴스를 저장
  }

  // 현재 상태 반환
  getState() {
    return { ...this.#state };
  }

  // 상태 업데이트
  setState(partialState) {
    // 깊은 복사를 위한 재귀 함수
    const deepMerge = (target, source) => {
      const result = { ...target };

      for (const key in source) {
        if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
          result[key] = deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }

      return result;
    };

    this.#state = deepMerge(this.#state, partialState);
    this.#notify();
  }

  // 구독자 등록
  subscribe(observer) {
    this.#observers.add(observer);
    observer(this.getState()); // 초기 상태도 바로 알려줌

    // 구독 해제 함수 반환
    return () => {
      this.#observers.delete(observer);
    };
  }

  // 구독자에게 상태 변경 알림
  #notify() {
    this.#observers.forEach((observer) => observer(this.getState()));
  }

  reset(initialState) {
    this.#state = { ...initialState };
    this.#notify();
  }

  static resetInstance() {
    Store.#instance = null;
  }
}
