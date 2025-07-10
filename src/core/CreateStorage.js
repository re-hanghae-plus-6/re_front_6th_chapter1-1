class CreateStorage {
  constructor(storage = window.localStorage) {
    this.storage = storage;
    this.listeners = {};
  }

  get(key) {
    const value = this.storage.getItem(key);
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  set(key, value) {
    const data = typeof value === 'string' ? value : JSON.stringify(value);
    this.storage.setItem(key, data);
    this.notify(key);
  }

  remove(key) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }

  subscribe(key, callback) {
    if (!this.listeners[key]) this.listeners[key] = [];
    this.listeners[key].push(callback);

    // 구독 해제 함수 반환
    return () => {
      this.listeners[key] = this.listeners[key].filter((fn) => fn !== callback);
    };
  }

  notify(key) {
    if (!this.listeners[key]) return;
    const value = this.get(key);
    this.listeners[key].forEach((cb) => cb(value));
  }
}

export default CreateStorage;
