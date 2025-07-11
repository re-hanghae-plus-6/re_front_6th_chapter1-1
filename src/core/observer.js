export default function createObserver() {
  // 내부 Set 으로 구독자 관리
  const listeners = new Set();

  /**
   * 리스너를 등록하고 해제 함수를 반환합니다.
   * @param {Function} listener
   * @returns {() => void} unsubscribe 함수
   */
  function subscribe(listener) {
    if (typeof listener !== "function") return () => {};
    listeners.add(listener);
    // 해제 함수 반환
    return () => listeners.delete(listener);
  }

  /**
   * 모든 리스너에게 데이터를 전달합니다.
   * @param  {...any} args
   */
  function notify(...args) {
    listeners.forEach((fn) => {
      try {
        fn(...args);
      } catch (err) {
        console.error("[Observer] listener error", err);
      }
    });
  }

  return { subscribe, notify };
}
