// local용인가?? 현재 상태로는 판단 불가
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
