export function createStore(initialState) {
  let state = { ...initialState };
  const listeners = new Set();

  function subscribe(listener) {
    listeners.add(listener);
    listener(state);

    return () => listeners.delete(listener);
  }

  function getState() {
    return state;
  }

  function setState(newState) {
    state = { ...state, ...newState };
    listeners.forEach((listener) => listener(state));
  }

  return {
    subscribe,
    getState,
    setState,
  };
}
