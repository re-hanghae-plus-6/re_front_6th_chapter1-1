class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.subscribers = new Set();
    this.middlewares = [];
  }

  getState() {
    return { ...this.state };
  }

  setState(updater) {
    const prevState = { ...this.state };

    this.state = { ...this.state, ...updater };

    // 미들웨어 실행
    this.middlewares.forEach((middleware) => {
      middleware(prevState, this.state);
    });

    // 구독자들에게 변경 알림
    this.notifySubscribers(prevState, this.state);
  }

  setStateByKey(key, value) {
    this.setState({ [key]: value });
  }

  subscribe(callback) {
    this.subscribers.add(callback);

    return () => {
      this.subscribers.delete(callback);
    };
  }

  notifySubscribers(prevState, currentState) {
    this.subscribers.forEach((callback) => {
      try {
        callback(currentState, prevState);
      } catch (error) {
        console.error("상태 변경 콜백 실행 중 오류:", error);
      }
    });
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  reset(initialState) {
    const prevState = { ...this.state };
    this.state = { ...initialState };
    this.notifySubscribers(prevState, this.state);
  }

  getStateByKey(key) {
    return this.state[key];
  }

  select(predicate) {
    return predicate(this.state);
  }
}

const store = new Store();

export default store;
