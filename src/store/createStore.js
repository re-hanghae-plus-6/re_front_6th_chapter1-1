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

      console.log("🔄 Store 상태 변경:", {
        이전상태: prevState,
        새상태: state,
      });

      // 리스너들에게 알림
      listeners.forEach((listener) => listener(state, prevState));
    },

    // 구독 관리
    subscribe: (listener) => {
      listeners.push(listener);
      console.log("📢 리스너 등록됨. 총 리스너 수:", listeners.length);

      return () => {
        listeners = listeners.filter((l) => l !== listener);
        console.log("📢 리스너 해제됨. 총 리스너 수:", listeners.length);
      };
    },

    // 스토어 리셋
    reset: () => {
      state = initialState;
      console.log("🔄 Store 리셋됨:", state);
      listeners.forEach((listener) => listener(state));
    },
  };
}
