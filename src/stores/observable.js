/**
 * 옵저버 패턴을 구현하는 공통 유틸리티
 * 모든 스토어에서 재사용할 수 있는 subscribe/notify 기능을 제공
 */
export function createObservable() {
  let listeners = [];

  return {
    /**
     * 구독자를 등록하고 구독 해제 함수를 반환
     * @param {Function} listener - 상태 변경 시 호출될 콜백 함수
     * @returns {Function} 구독 해제 함수
     */
    subscribe(listener) {
      if (typeof listener !== "function") {
        throw new Error("Listener must be a function");
      }

      listeners.push(listener);

      // 구독 해제 함수 반환
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },

    /**
     * 모든 구독자에게 상태 변경을 알림
     */
    notify() {
      listeners.forEach((listener) => {
        try {
          listener();
        } catch (error) {
          console.error("Error in listener:", error);
        }
      });
    },

    /**
     * 현재 구독자 수를 반환 (디버깅용)
     */
    getListenerCount() {
      return listeners.length;
    },

    /**
     * 모든 구독자를 제거 (테스트용)
     */
    clearListeners() {
      listeners = [];
    },
  };
}
