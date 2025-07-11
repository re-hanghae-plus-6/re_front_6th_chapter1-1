// 기본 Store 클래스
export class BaseStore {
  constructor() {
    this.listeners = [];
  }

  // 상태 변경 알림을 위한 구독자 등록
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // 상태 변경 시 모든 구독자에게 알림
  notify() {
    this.listeners.forEach((listener) => listener());
  }

  // 상태 업데이트 (자식 클래스에서 구현)
  setState(newState) {
    Object.assign(this, newState);
    this.notify();
  }
}
