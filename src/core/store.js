import createObserver from "./observer.js";

export default function createStore(initialState = {}) {
  let state = { ...initialState };

  // 옵저버로 리스너 관리
  const { subscribe, notify } = createObserver();

  function setState(partial) {
    // 변경 사항이 없으면 무시
    if (!partial || (typeof partial === "object" && Object.keys(partial).length === 0)) return;
    state = { ...state, ...partial };
    notify(state);
  }

  /** 현재 상태를 반환 */
  const getState = () => state;

  return {
    subscribe,
    setState,
    getState,
  };
}
