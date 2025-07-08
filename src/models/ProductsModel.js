import { getProducts } from "../api/productApi.js";

export class ProductsModel {
  constructor(initialFilters = {}) {
    this.state = {
      products: [],
      loading: true,
      totalCount: 0,
      hasMore: false,
      filters: {
        limit: 20,
        sort: "price_asc",
        search: "",
        category1: "",
        category2: "",
        ...initialFilters,
      },
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

  async updateFilters(newFilters) {
    this.state.filters = { ...this.state.filters, ...newFilters };
    await this.fetchProducts();
  }

  async fetchProducts() {
    this.state.loading = true;
    this.notify();

    const response = await getProducts(this.state.filters);

    this.state.products = response.products || [];
    this.state.totalCount = response.pagination?.total || 0;
    this.state.hasMore = response.pagination?.hasNext || false;
    this.state.loading = false;

    this.notify();
  }

  async initialize() {
    await this.fetchProducts();
  }

  getState() {
    return { ...this.state };
  }
}
