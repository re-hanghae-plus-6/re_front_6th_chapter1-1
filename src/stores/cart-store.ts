import type { CartItem } from "../types/cart.ts";

const CART_KEY = "cart_items";

let items: CartItem[] = loadFromStorage();
const listeners: Array<(items: CartItem[]) => void> = [];

function loadFromStorage(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function persist() {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function notify() {
  persist();
  listeners.forEach((fn) => fn(items));
}

export const cartStore = {
  // 구독
  subscribe(fn: (items: CartItem[]) => void) {
    listeners.push(fn);
    fn(items);
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx > -1) listeners.splice(idx, 1);
    };
  },

  // 외부에서 상태 덮어쓰기
  setItems(newItems: CartItem[]) {
    items = [...newItems];
    notify();
  },

  add(id: string, qty = 1, price?: number, title?: string) {
    const idx = items.findIndex((it) => it.id === id);
    if (idx > -1) {
      items[idx].qty += qty;
      if (price !== undefined) items[idx].price = price;
      if (title !== undefined) items[idx].title = title;
    } else {
      items.push({ id, qty, price, title });
    }
    notify();
  },

  updateQty(id: string, qty: number) {
    const it = items.find((i) => i.id === id);
    if (it) {
      it.qty = Math.max(1, qty);
      notify();
    }
  },

  remove(id: string) {
    items = items.filter((i) => i.id !== id);
    notify();
  },

  clear() {
    items = [];
    notify();
  },

  getItems() {
    return [...items];
  },

  getCount() {
    return items.reduce((sum, it) => sum + (it.qty ?? 0), 0);
  },

  // *** 테스트 전용 헬퍼
  // 테스트가 연달아 실행되는 특성상 다음 테스트로의 영향 고리를 끊어내도록 로직을 강화함.
  // items가 로컬스토리지의 원본역할을 하게 했고, items를 비워줌으로써 더 확실하게 초기화함.
  // 다음 테스트가 빠르게 연달아 진행될때 items 초기화를 먼저 거친다면 로컬스토리지는 이전 값을 누적해서 쓰지 않게 됨
  __resetForTest() {
    items = [];
    localStorage.clear();
  },
} as const;
