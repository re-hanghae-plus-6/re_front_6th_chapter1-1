export class CartComputed {
  #store;
  #cache = new Map();

  constructor(store) {
    this.#store = store;
  }

  get totalCount() {
    const items = this.#store.getState().cart.items;
    return this.#computeWithCache("totalCount", items, (items) => items.length);
  }

  get totalPrice() {
    const items = this.#store.getState().cart.items;
    return this.#computeWithCache("totalPrice", items, (items) => {
      return items.reduce((sum, item) => {
        if (!item.product || !item.product.lprice) {
          console.warn("Invalid product in totalPrice calculation:", item);
          return sum;
        }
        const price = parseInt(item.product.lprice, 10);
        return sum + price * item.quantity;
      }, 0);
    });
  }

  get selectedItems() {
    const items = this.#store.getState().cart.items;
    return this.#computeWithCache("selectedItems", items, (items) => items.filter((item) => item.selected));
  }

  get selectedPrice() {
    const selectedItems = this.selectedItems;
    return selectedItems.reduce((sum, item) => {
      if (!item.product || !item.product.lprice) {
        console.warn("Invalid product in selectedPrice calculation:", item);
        return sum;
      }
      const price = parseInt(item.product.lprice, 10);
      return sum + price * item.quantity;
    }, 0);
  }

  get hasItems() {
    const items = this.#store.getState().cart.items;
    return this.#computeWithCache("hasItems", items, (items) => items.length > 0);
  }

  get hasSelectedItems() {
    const selectedItems = this.selectedItems;
    return this.#computeWithCache("hasSelectedItems", selectedItems, (items) => items.length > 0);
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
}
