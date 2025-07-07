import { createObserver } from "./createObserver.js";

export function createState(initialState) {
  let state = { ...initialState };
  const observer = createObserver();

  const subscribe = (callback) => {
    observer.subscribe(callback);
    return () => observer.unsubscribe(callback);
  };

  const setState = (newState) => {
    const prevState = { ...state };
    state = { ...state, ...newState };

    observer.notify(state, prevState);
  };

  const getState = () => ({ ...state });

  return {
    subscribe,
    setState,
    getState,
  };
}
