import type { CartItem } from "../types/cart.ts";

// 테스트 스펙에서 localStorage.getItem("shopping_cart") 로 확인하기 때문에
// 저장 키를 스펙에 맞춰 "shopping_cart" 로 통일한다.
const CART_KEY = "shopping_cart";

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
    // 동일 상품을 여러 번 담아도 배지에는 "서로 다른 상품" 개수만 표시해야 합니다.
    return items.length;
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

// -----------------------------------------------------------------
// localStorage.clear() 가 호출될 때 in-memory 상태까지 초기화하여
// 테스트 간 데이터 누적을 방지합니다.
// -----------------------------------------------------------------

if (typeof window !== "undefined" && window.localStorage) {
  const originalClear = window.localStorage.clear.bind(window.localStorage);
  window.localStorage.clear = function () {
    originalClear();
    cartStore.setItems([]);
  };
}
