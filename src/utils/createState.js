export function createState(initialState) {
  let state = { ...initialState };
  const subscribers = [];

  const subscribe = (callback) => {
    subscribers.push(callback);

    return () => {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    };
  };

  const setState = (newState) => {
    const prevState = { ...state };
    state = { ...state, ...newState };

    subscribers.forEach((callback) => {
      callback(state, prevState);
    });
  };

  const getState = () => ({ ...state });

  return {
    subscribe,
    setState,
    getState,
  };
}
