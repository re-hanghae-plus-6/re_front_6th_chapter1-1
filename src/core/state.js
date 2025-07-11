import createObserver from "./observer.js";

/**
 * createState – 간단한 전역/지역 상태 컨테이너 팩토리
 * 기존 createStore API( subscribe, setState, getState ) 와 동일한 시그니처를 제공합니다.
 *
 * @template T
 * @param {T} initialState 초기 상태 객체
 * @returns {{ subscribe: (fn: () => void) => () => void; setState: (partial: Partial<T>) => void; getState: () => T }}
 */
export default function createState(initialState = {}) {
  let state = { ...initialState };

  // 옵저버로 리스너 관리
  const { subscribe, notify } = createObserver();

  /**
   * 부분 상태를 병합하여 업데이트하고 구독자들에게 알림을 보냅니다.
   * @param {Partial<T>} partial 변경할 부분 상태
   */
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
