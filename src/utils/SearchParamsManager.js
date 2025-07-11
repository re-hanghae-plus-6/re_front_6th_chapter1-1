class SearchParamsManager {
  #observers = new Map(); // key별 observer 배열 관리
  #currentParams = {};

  constructor() {
    this.#currentParams = this.#getUrlSearchParams();

    // popstate 이벤트 리스너 등록 (브라우저 뒤로가기/앞으로가기 대응)
    window.addEventListener("popstate", () => {
      this.#handleParamsChange();
    });
  }

  // URL에서 현재 search parameter 조회
  #getUrlSearchParams() {
    return Object.fromEntries(new URLSearchParams(window.location.search));
  }

  // 현재 search parameter 값 조회
  getParams(key) {
    if (key) {
      return this.#currentParams[key];
    }
    return { ...this.#currentParams };
  }

  // search parameter 업데이트
  updateParams(params, options = {}) {
    const currentPath = window.location.pathname;
    const searchParams = new URLSearchParams();

    // 기존 params와 새 params 병합
    const mergedParams = { ...this.#currentParams, ...params };

    // null/undefined 값 제거하여 URL에서 파라미터 삭제
    Object.entries(mergedParams).forEach(([key, value]) => {
      if (value != null) {
        searchParams.set(key, value);
      }
    });

    const newURL = searchParams.toString() ? `${currentPath}?${searchParams.toString()}` : currentPath;

    if (options.replace) {
      window.history.replaceState(null, "", newURL);
    } else {
      window.history.pushState(null, "", newURL);
    }

    this.#handleParamsChange();
  }

  // 파라미터 변경 감지 및 구독자들에게 알림
  #handleParamsChange() {
    const newParams = this.#getUrlSearchParams();
    const changedKeys = new Set();

    // 변경된 키들 찾기
    Object.keys({ ...this.#currentParams, ...newParams }).forEach((key) => {
      if (this.#currentParams[key] !== newParams[key]) {
        changedKeys.add(key);
      }
    });

    // 이전 상태 업데이트
    this.#currentParams = newParams;

    // 변경된 키에 대한 구독자들에게 알림
    changedKeys.forEach((key) => {
      if (this.#observers.has(key)) {
        this.#observers.get(key).forEach((callback) => {
          callback(newParams[key], newParams);
        });
      }
    });

    // 전체 변경 구독자들에게 알림 ('*' 키 사용)
    if (this.#observers.has("*")) {
      this.#observers.get("*").forEach((callback) => {
        callback(newParams, Array.from(changedKeys));
      });
    }
  }

  // 특정 파라미터 변경 구독
  subscribe(key, callback) {
    if (!this.#observers.has(key)) {
      this.#observers.set(key, []);
    }
    this.#observers.get(key).push(callback);

    // 구독 해제 함수 반환
    return () => {
      const callbacks = this.#observers.get(key);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // 구독 해제
  unsubscribe(key, callback) {
    const callbacks = this.#observers.get(key);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // 모든 구독 해제
  unsubscribeAll(key) {
    if (key) {
      this.#observers.delete(key);
    } else {
      this.#observers.clear();
    }
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
export const searchParamsManager = new SearchParamsManager();
export default searchParamsManager;
