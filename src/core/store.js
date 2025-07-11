export class Store {
  #observers = new Set();
  #state;

  constructor(initialState = {}) {
    this.#state = initialState;
  }

  /** 현재 상태 반환 */
  get state() {
    return this.#state;
  }

  /** 부분 업데이트 & 통지 */
  setState(partial) {
    // 중첩 객체 병합(얕은)
    Object.entries(partial).forEach(([k, v]) => {
      if (typeof v === "object" && v !== null && !Array.isArray(v)) {
        this.#state[k] = { ...this.#state[k], ...v };
      } else {
        this.#state[k] = v;
      }
    });
    this.#notify();
  }

  /** 구독 */
  subscribe(fn) {
    this.#observers.add(fn);
    return () => this.#observers.delete(fn);
  }

  /** 초기 상태로 리셋 */
  reset(initialState) {
    this.#state = JSON.parse(JSON.stringify(initialState));
    this.#notify();
  }

  #notify() {
    this.#observers.forEach((fn) => fn(this.#state));
  }
}
