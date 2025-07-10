// 공통 useStore 훅 (바닐라 JS 버전)
export function useStore(store, selector = (state) => state) {
  let currentValue = selector(store.getState());
  let updateCallback = null;

  // 상태 변경 감지 및 리렌더링 트리거
  const unsubscribe = store.subscribe((newState) => {
    const newValue = selector(newState);
    if (newValue !== currentValue) {
      currentValue = newValue;
      if (updateCallback) {
        updateCallback(newValue);
      }
    }
  });

  // 리렌더링 콜백 등록
  const setUpdateCallback = (callback) => {
    updateCallback = callback;
  };

  // 값과 setter 반환
  return {
    value: currentValue,
    setValue: store.setState,
    setUpdateCallback,
    unsubscribe,
  };
}
