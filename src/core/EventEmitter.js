export class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  /**
   * 이벤트 리스너를 등록합니다
   *
   * @param {string} event - 이벤트 이름
   * @param {Function} callback - 콜백 함수
   * @returns {EventEmitter} - 체이닝을 위한 this 반환
   */
  on(event, callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }

    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    this.events.get(event).push({
      callback,
      once: false,
    });

    return this;
  }

  /**
   * 한 번만 실행되는 이벤트 리스너를 등록합니다
   *
   * @param {string} event - 이벤트 이름
   * @param {Function} callback - 콜백 함수
   * @returns {EventEmitter} - 체이닝을 위한 this 반환
   */
  once(event, callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }

    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    this.events.get(event).push({
      callback,
      once: true,
    });

    return this;
  }

  /**
   * 이벤트 리스너를 제거합니다
   *
   * @param {string} event - 이벤트 이름
   * @param {Function} callback - 제거할 콜백 함수
   * @returns {EventEmitter} - 체이닝을 위한 this 반환
   */
  off(event, callback) {
    if (!this.events.has(event)) {
      return this;
    }

    const listeners = this.events.get(event);
    const index = listeners.findIndex((listener) => listener.callback === callback);

    if (index !== -1) {
      listeners.splice(index, 1);
    }

    // 리스너가 없으면 이벤트 자체를 제거
    if (listeners.length === 0) {
      this.events.delete(event);
    }

    return this;
  }

  /**
   * 특정 이벤트의 모든 리스너를 제거합니다
   *
   * @param {string} event - 이벤트 이름 (없으면 모든 이벤트)
   * @returns {EventEmitter} - 체이닝을 위한 this 반환
   */
  removeAllListeners(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }

  /**
   * 이벤트를 발생시킵니다
   *
   * @param {string} event - 이벤트 이름
   * @param {...any} args - 콜백에 전달할 인수들
   * @returns {boolean} - 리스너가 있었는지 여부
   */
  emit(event, ...args) {
    if (!this.events.has(event)) {
      return false;
    }

    const listeners = this.events.get(event).slice();
    const toRemove = [];

    listeners.forEach((listener) => {
      try {
        listener.callback.apply(this, args);

        // once 리스너는 실행 후 제거 대상에 추가
        if (listener.once) {
          toRemove.push(listener.callback);
        }
      } catch (error) {
        console.error("Error in event listener:", error);
      }
    });

    toRemove.forEach((callback) => {
      this.off(event, callback);
    });

    return true;
  }
}
