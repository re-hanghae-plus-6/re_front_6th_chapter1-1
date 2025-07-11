export const store = {
  state: {
    mounted: false,
    cartItems: [],
    isCartModalOpen: false,
  },
  getState: (key) => {
    if (localStorage.getItem(key)) {
      store.state[key] = JSON.parse(localStorage.getItem(key));
      return store.state[key];
    }
    return store.state[key];
  },
  setState: (key, value, { persist = false } = {}) => {
    store.state[key] = value;
    if (persist) {
      localStorage.setItem(key, JSON.stringify(value));
    }
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
