export function createObserver() {
  const callbacks = new Set();

  const subscribe = (callback) => {
    callbacks.add(callback);
  };

  const unsubscribe = (callback) => {
    callbacks.delete(callback);
  };

  const notify = (data, prevData) => {
    callbacks.forEach((callback) => {
      callback(data, prevData);
    });
  };

  return {
    subscribe,
    unsubscribe,
    notify,
  };
}
