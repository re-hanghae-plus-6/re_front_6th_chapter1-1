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

  /**
   * 특정 상품의 수량을 1 증가시킵니다
   *
   * @param {string} productId - 상품 ID
   * @returns {boolean} 성공 여부
   */
  increaseQuantity(productId) {
    const items = this.cartStorage.get("items") || [];
    const itemIndex = items.findIndex((item) => item.id === productId);

    if (itemIndex !== -1) {
      items[itemIndex].quantity += 1;
      return this.cartStorage.set("items", items);
    }

    return false;
  }

  /**
   * 특정 상품의 수량을 1 감소시킵니다
   *
   * @param {string} productId - 상품 ID
   * @returns {boolean} 성공 여부
   */
  decreaseQuantity(productId) {
    const items = this.cartStorage.get("items") || [];
    const itemIndex = items.findIndex((item) => item.id === productId);

    if (itemIndex !== -1) {
      const currentQuantity = items[itemIndex].quantity;

      if (currentQuantity > 1) {
        // 수량이 1보다 크면 1 감소
        items[itemIndex].quantity -= 1;
        return this.cartStorage.set("items", items);
      }
    }

    return false;
  }
}

export const cartService = CartService.getInstance();
