export const createObserver = () => {
  const observers = new Set();

  const subscribe = (callback) => {
    observers.add(callback);
  };

  const unsubscribe = (callback) => {
    observers.delete(callback);
  };

  const notify = () => {
    observers.forEach((callback) => callback());
  };

  return { subscribe, unsubscribe, notify };
};
