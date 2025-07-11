import { cartStore } from "../stores/cart-store.ts";
import type { CartItem } from "../types/cart.ts";

let badgeUnsub: (() => void) | null = null;

export function bindCartBadge(buttonSelector: string = "#cart-icon-btn") {
  // 중복 바인딩 방지
  badgeUnsub?.();

  const update = (items: CartItem[]) => {
    const btn = document.querySelector<HTMLButtonElement>(buttonSelector);
    if (!btn) return;

    let badge = btn.querySelector<HTMLSpanElement>("[data-cart-badge]");
    // 고유 상품 개수로 배지를 표시합니다. 동일 상품을 여러 번 담아도 1로 집계합니다.
    const count = items.length;

    if (count === 0) {
      badge?.remove();
      return;
    }

    if (!badge) {
      badge = document.createElement("span");
      badge.setAttribute("data-cart-badge", "");
      badge.className =
        "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center";
      btn.appendChild(badge);
    }
    badge.textContent = String(count);
  };

  // 초기 실행
  update(cartStore.getItems());
  const unsub = cartStore.subscribe(update);
  badgeUnsub = unsub;
  return unsub;
}
