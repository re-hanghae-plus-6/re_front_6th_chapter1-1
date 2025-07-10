export class WebStorage {
  constructor(key, storage = window.localStorage) {
    this.storage = storage;
    this.key = key;
  }

  getItem(key) {
    try {
      const data = JSON.parse(this.storage.getItem(this.key));
      return key ? data[key] : data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  setItem(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  removeItem(key) {
    this.storage.removeItem(key);
  }
}
