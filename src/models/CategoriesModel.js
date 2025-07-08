import { getCategories } from "../api/productApi.js";

export class CategoriesModel {
  constructor() {
    this.state = {
      categories: [],
      loading: true,
    };
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    callback({ ...this.state });

    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  notify() {
    this.subscribers.forEach((callback) => callback({ ...this.state }));
  }

  async fetchCategories() {
    this.state.loading = true;
    this.notify();

    const categories = await getCategories();

    this.state.categories = categories || [];
    this.state.loading = false;
    this.notify();
  }

  async initialize() {
    await this.fetchCategories();
  }

  getState() {
    return { ...this.state };
  }
}
