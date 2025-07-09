// store.js - 싱글톤 패턴을 사용한 전역 상태 스토어

// 싱글톤 스토어 클로저
export const createStore = (() => {
  let instance = null;

  function Store(initialState = {}) {
    if (instance) {
      return instance;
    }

    let state = { ...initialState };
    const listeners = new Set();

    // 스토어 인스턴스 객체
    instance = {
      // 상태 가져오기
      getState() {
        return state;
      },

      // 상태 설정하기
      setState(partial) {
        state = { ...state, ...partial };
        instance.notify();
      },

      // 구독하기
      subscribe(listener) {
        listeners.add(listener);

        // 구독 해제 함수 반환
        return () => listeners.delete(listener);
      },

      notify() {
        // 모든 구독자에게 알림
        listeners.forEach((listener) => listener());
      },
    };

    return instance;
  }

  return Store;
})();
