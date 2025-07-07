import { initialState } from "./state.js";
import { reducer } from "./reducer.js";

class Store {
  constructor() {
    this.state = initialState;
    this.listeners = [];
  }

  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  dispatch(action) {
    const oldState = this.state;
    this.state = reducer(oldState, action);
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

export const store = new Store();

window.Storage = store;
