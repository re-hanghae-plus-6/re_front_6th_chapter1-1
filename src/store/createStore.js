// 공통 Store 팩토리 함수
export function createStore(initialState) {
  let state = initialState;
  let listeners = [];

  return {
    // 상태 조회
    getState: () => state,

    // 상태 업데이트
    setState: (newState) => {
      const prevState = state;
      state = typeof newState === "function" ? newState(prevState) : { ...prevState, ...newState };

      // 리스너들에게 알림
      listeners.forEach((listener) => listener(state, prevState));
    },

    // 구독 관리
    subscribe: (listener) => {
      listeners.push(listener);

      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },

    // 스토어 리셋
    reset: () => {
      state = initialState;
      listeners.forEach((listener) => listener(state));
    },
  };
}
