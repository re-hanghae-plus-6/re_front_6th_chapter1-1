// Store.js - 싱글톤 + 옵저버 패턴을 사용한 전역 상태 스토어

export class Store {
  static instance = null;

  constructor(initialState = {}) {
    // 싱글톤 패턴: 이미 인스턴스가 있으면 반환
    if (Store.instance) {
      return Store.instance;
    }

    this.state = { ...initialState };
    this.observers = new Set();

    // 동적 프로퍼티 정의 (상태 접근을 위한 getter/setter)
    Object.keys(initialState).forEach((key) => {
      Object.defineProperty(this, key, {
        get: () => this.state[key],
        set: (value) => {
          this.state[key] = value;
          this.notify();
        },
      });
    });

    // 인스턴스 저장
    Store.instance = this;
  }

  // 상태 가져오기
  getState() {
    return { ...this.state };
  }

  // 전체 상태 설정
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  // 옵저버 등록 (구독)
  subscribe(observer) {
    this.observers.add(observer);

    // 구독 해제 함수 반환
    return () => {
      this.observers.delete(observer);
    };
  }

  // 옵저버 제거 (구독 해제)
  unsubscribe(observer) {
    this.observers.delete(observer);
  }

  // 모든 옵저버에게 알림
  notify() {
    this.observers.forEach((observer) => {
      try {
        observer(this.state);
      } catch (error) {
        console.error("Observer notification error:", error);
      }
    });
  }

  // 스토어 인스턴스 가져오기
  static getInstance() {
    if (!Store.instance) {
      throw new Error("Store not initialized. Call new Store(initialState) first.");
    }
    return Store.instance;
  }
}

// 스토어 생성 헬퍼 함수
export function createStore(initialState = {}) {
  return new Store(initialState);
}
