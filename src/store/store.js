export const cartStore = {
  state: {
    isOpen: false,
  },

  subscribers: [],

  // 상태 구독 (필요한 컴포넌트에서 사용)
  subscribe(callback) {
    this.subscribers.push(callback);
  },

  // 상태 변경
  setState(nextState) {
    this.state = { ...this.state, ...nextState };
    this.notify();
  },

  // 구독자에게 알림
  notify() {
    this.subscribers.forEach((callback) => callback(this.state));
  },

  // 상태 조회
  getState() {
    return this.state;
  },
};
