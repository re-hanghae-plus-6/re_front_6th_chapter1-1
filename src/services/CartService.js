import { StorageManager } from "../core/StorageManager";

class CartService {
  static #instance = null;

  constructor() {
    if (CartService.#instance) {
      return CartService.#instance;
    }

    this.cartStorage = new StorageManager(StorageManager.TYPES.LOCAL_STORAGE);
    this.cartStorage.setPrefix("cart");

    CartService.#instance = this;
  }

  get items() {
    return this.cartStorage.get("items") || [];
  }

  get totalCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  get itemCount() {
    return this.items.length;
  }

  static getInstance() {
    if (!CartService.#instance) {
      CartService.#instance = new CartService();
    }

    return CartService.#instance;
  }

  addItem(product, quantity = 1) {
    const items = this.cartStorage.get("items") || [];
    const existingItemIndex = items.findIndex((item) => item.id === product.id);

    if (existingItemIndex !== -1) {
      items[existingItemIndex].quantity += quantity;
    } else {
      items.push({ ...product, quantity });
    }

    return this.cartStorage.set("items", items);
  }

  removeItem(productId) {
    const items = this.cartStorage.get("items") || [];
    const filteredItems = items.filter((item) => item.productId !== productId);
    return this.cartStorage.set("items", filteredItems);
  }

  updateItemCount(productId, count) {
    const items = this.cartStorage.get("items") || [];
    const itemIndex = items.findIndex((item) => item.productId === productId);

    if (itemIndex !== -1) {
      items[itemIndex].count = count;
      return this.cartStorage.set("items", items);
    }

    return false;
  }
}

export const createCartService = CartService.getInstance;
