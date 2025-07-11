export const createStore = (reducer, initialState) => {
  let state = initialState;
  const listeners = [];

  /** 상태 조회 */
  const getState = () => state;

  /** 상태 변경 */
  const dispatch = (action) => {
    console.log("🚀 Action:", action.type, action.payload);

    // 리듀서로 새로운 상태 계산
    state = reducer(state, action);

    // 등록된 모든 함수들 실행 (보통 render 함수)
    listeners.forEach((listener) => listener());
  };

  /** 구독 등록 */
  const subscribe = (listener) => {
    listeners.push(listener);

    // 구독 취소 함수 반환
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  };

  return { getState, dispatch, subscribe };
};
