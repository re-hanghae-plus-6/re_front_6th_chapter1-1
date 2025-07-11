import { initialState } from "./state.js";
import { reducer } from "./reducers/index.js";
import { CartComputed } from "./computed/cartComputed.js";
import { saveCartToStorage } from "./utils/storage.js";

class Store {
  #state = initialState;
  #listeners = [];
  #lastAction = null;
  #computed = {
    cart: new CartComputed(this),
  };

  constructor() {}

  getState() {
    return JSON.parse(JSON.stringify(this.#state));
  }

  get computed() {
    return this.#computed;
  }

  getLastAction() {
    return this.#lastAction;
  }

  dispatch(action) {
    if (typeof action === "function") {
      return action(this.dispatch.bind(this));
    }

    this.#lastAction = action;
    const oldState = this.#state;
    this.#state = reducer(oldState, action);
    this.#computed.cart.clearCache();
    this.#listeners.forEach((listener) => listener(this.#state));
  }

  subscribe(listener) {
    this.#listeners.push(listener);

    return () => {
      this.#listeners = this.#listeners.filter((l) => l !== listener);
    };
  }

  reset() {
    this.#state = JSON.parse(JSON.stringify(initialState));
    this.#computed.cart.clearCache();
    if (import.meta.env.MODE === "test") {
      this.#computed = {
        cart: new CartComputed(this),
      };
    }
    this.#listeners.forEach((listener) => listener(this.#state));
  }
}

export const store = new Store();

store.subscribe((state) => {
  saveCartToStorage(state.cart.items);
});
