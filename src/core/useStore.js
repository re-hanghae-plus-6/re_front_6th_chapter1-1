const useStore = (() => {
  // 장바구니, params 등 전역적으로 쓰일 상태들
  const globalState = {};

  const listener = [];

  // 전역 상태를 가져오는 함수
  const get = (key) => {
    if (!key) {
      return globalState;
    } else {
      return globalState[key];
    }
  };

  // 전역 상태를 만드는 함수
  const set = (key, value) => {
    globalState[key] = value;

    listener.forEach(({ callback, targetKey }) => {
      if (!targetKey || targetKey === key) {
        callback(globalState[key], globalState);
      }
    });
  };

  // 전역 상태가 변경됐음을 감지해 주는 함수
  const watch = (callback, targetKey = null) => {
    listener.push({ callback, targetKey });

    return () => {
      const index = listener.findIndex((l) => l.callback === callback && l.targetKey === targetKey);
      if (index !== -1) listener.splice(index, 1);
    };
  };

  return () => ({ get, set, watch });
})();
export default useStore;
