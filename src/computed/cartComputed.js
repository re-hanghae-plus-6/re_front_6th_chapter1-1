export class CartComputed {
  #store;
  #cache = new Map();

  constructor(store) {
    this.#store = store;
  }

  get totalCount() {
    const items = this.#store.getState().cart.items;
    return this.#computeWithCache("totalCount", items, (items) => items.reduce((sum, item) => sum + item.quantity, 0));
  }

  get totalPrice() {
    const items = this.#store.getState().cart.items;
    return this.#computeWithCache("totalPrice", items, (items) =>
      items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    );
  }

  get selectedItems() {
    const items = this.#store.getState().cart.items;
    return this.#computeWithCache("selectedItems", items, (items) => items.filter((item) => item.selected));
  }

  get selectedCount() {
    const selectedItems = this.selectedItems;
    return selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  get selectedPrice() {
    const selectedItems = this.selectedItems;
    return selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  get hasItems() {
    return this.#store.getState().cart.items.length > 0;
  }

  get hasSelectedItems() {
    return this.selectedItems.length > 0;
  }

  #computeWithCache(key, dependency, computeFn) {
    const depKey = JSON.stringify(dependency);
    const cacheKey = `${key}_${depKey}`;

    if (this.#cache.has(cacheKey)) {
      return this.#cache.get(cacheKey);
    }

    const result = computeFn(dependency);
    this.#cache.set(cacheKey, result);
    return result;
  }

  clearCache() {
    this.#cache.clear();
  }

  hasProduct(productId) {
    const items = this.#store.getState().cart.items;
    return items.some((item) => item.productId === productId);
  }

  getProductQuantity(productId) {
    const items = this.#store.getState().cart.items;
    const item = items.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  }
}
