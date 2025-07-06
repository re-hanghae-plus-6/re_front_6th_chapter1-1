const createStateManager = (initialState) => {
  let state = { ...initialState };

  const listeners = new Set();

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const setState = (partial) => {
    state = { ...state, ...partial };
    listeners.forEach((listener) => listener());
  };

  const getState = () => state;

  return {
    subscribe,
    setState,
    getState,
  };
};

export default createStateManager;
