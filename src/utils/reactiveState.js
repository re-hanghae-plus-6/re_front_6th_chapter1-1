export default function createReactiveState(defaultValue) {
  let state = defaultValue;
  let callback = () => {};
  function getState() {}

  function updateState(updater) {
    state = typeof updater === "function" ? updater(state) : updater;
    callback(state);
  }

  function onChange(_callback) {
    callback = _callback;
  }

  return {
    getState,
    updateState,
    onChange,
  };
}

export function createView() {}
