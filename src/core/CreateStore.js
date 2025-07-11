class CreateStore {
  state = {};
  listeners = [];
  constructor(initialState) {
    this.state = initialState;
  }

  getState() {
    return this.state;
  }
  setState(newState) {
    this.state = {
      ...this.state,
      ...newState,
    };
    this.listeners.forEach((fn) => fn(this.state));
  }
  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((f) => f !== fn);
    };
  }
}

export default CreateStore;
