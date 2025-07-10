class CreateStorage {
  constructor(storage = window.localStorage) {
    this.storage = storage;
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
  }

  remove(key) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }
}

export default CreateStorage;
