export const store = {
  state: {
    mounted: false,
  },
  getState: (key) => {
    return store.state[key];
  },
  setState: (key, value) => {
    store.state[key] = value;
    // store.notify();
  },
  useState: (key) => {
    return [
      store.state[key],
      (value) => {
        store.state[key] = value;
      },
    ];
  },
  setStates: (states) => {
    for (const key in states) {
      store.state[key] = states[key];
    }
    // store.notify();
  },
  observers: [],
  subscribe: (observer) => {
    store.observers.push(observer);
  },
  unsubscribe: (observer) => {
    store.observers = store.observers.filter((o) => o !== observer);
  },
  notify: () => {
    store.observers.forEach((observer) => observer.update());
  },
};
