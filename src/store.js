import { initialState } from "./state.js";
import { reducer } from "./reducers/index.js";
import { CartComputed } from "./computed/cartComputed.js";

class Store {
  constructor() {
    this.state = initialState;
    this.listeners = [];
    this.computed = {
      cart: new CartComputed(this),
    };
  }

  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  dispatch(action) {
    const oldState = this.state;
    this.state = reducer(oldState, action);
    this.computed.cart.clearCache();
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  reset() {
    this.state = JSON.parse(JSON.stringify(initialState));
    this.computed.cart.clearCache();
    this.listeners.forEach((listener) => listener(this.state));
  }
}

export const store = new Store();

window.Storage = store;
