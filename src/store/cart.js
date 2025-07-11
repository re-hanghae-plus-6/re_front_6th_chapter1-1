import { observable, observe } from "../core/observer";
import { WebStorage } from "../utils/storage";
import { toast } from "../utils/toast";

const defaultParams = {
  open: false,
  count: 0,
  items: new Map(),
};

const storage = new WebStorage("cart");
let disposeObserveCard = null;

const observeCart = () => {
  disposeObserveCard = observe("cart", () => {
    const currentData = {};
    Object.keys(defaultParams).forEach((key) => {
      if (cartStore[key] instanceof Map) {
        currentData[key] = [...cartStore[key]];
      } else {
        currentData[key] = cartStore[key];
      }
    });
    storage.setItem("cart", currentData);
  });
};

export const cartStore = observable({
  ...defaultParams,

  init() {
    const data = { ...defaultParams, ...(storage.getItem() ?? {}), open: false };

    if (data) {
      for (const [key, value] of Object.entries(defaultParams)) {
        const currentValue = data[key] ?? value;
        if (value instanceof Map) {
          cartStore[key] = new Map(currentValue);
        } else {
          cartStore[key] = currentValue;
        }
      }
    }

    observeCart();
  },
  openModal() {
    cartStore.open = true;
  },
  closeModal() {
    cartStore.open = false;
  },
  hasItem(productId) {
    return cartStore.items.has(productId);
  },
  removeItem(productId) {
    cartStore.items.delete(productId);
    cartStore.items = new Map([...cartStore.items]);
    cartStore.count = cartStore.items.size;
  },
  removeSelectedItems() {
    const { items } = cartStore;
    items.forEach((product, productId) => {
      if (product.selected) {
        items.delete(productId);
      }
    });
    cartStore.items = new Map([...items]);
    cartStore.count = cartStore.items.size;
  },
  toggleSelectedItem(productId) {
    const item = cartStore.getItem(productId);
    item.selected = !item.selected;
    cartStore.items = new Map([...cartStore.items]);
  },
  selectAllItems() {
    const { items } = cartStore;
    items.forEach((item) => {
      item.selected = true;
    });
    cartStore.items = new Map([...items]);
  },
  addItem(product) {
    toast.success("장바구니에 추가되었습니다");

    if (cartStore.hasItem(product.productId)) {
      cartStore.addItemQuantity(product.productId, product.quantity ?? 1);
    } else {
      const { productId, lprice, image, title, quantity = 1, selected = false } = product;
      const item = {
        productId,
        lprice,
        image,
        title,
        selected,
        quantity,
      };
      cartStore.items.set(productId, item);
      cartStore.items = new Map([...cartStore.items]);
      cartStore.count = cartStore.items.size;
    }
  },
  getItem(productId) {
    return cartStore.items.get(productId);
  },
  addItemQuantity(productId, addQuantity) {
    if (!cartStore.hasItem(productId)) {
      throw new Error(`${productId} is not in cart`);
    }

    const item = cartStore.getItem(productId);
    item.quantity = Math.max(item.quantity + addQuantity, 1);
    cartStore.items = new Map([...cartStore.items]);
  },
  updateItem(productId, key, value) {
    if (!cartStore.hasItem(productId)) {
      throw new Error(`${productId} is not in cart`);
    }

    const item = cartStore.getItem(productId);
    item[key] = value;
    cartStore.items = new Map([...cartStore.items]);
  },
  dispose() {
    if (disposeObserveCard) {
      disposeObserveCard();
      disposeObserveCard = null;
    }
  },
});
