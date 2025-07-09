import { getCartItems as _getStoredItems, setCartItems, type CartItem as StoredCartItem } from "../../utils/cart.ts";
import { getProduct } from "../../api/productApi.js";
import { 장바구니_빈컨텐츠, 장바구니_아이템리스트 } from "./cart-body.ts";
import type { CartItem } from "./cart-body.ts";

export async function 장바구니() {
  if (document.querySelector(".cart-modal-overlay")) return;

  const overlay = document.createElement("div");
  overlay.className = "cart-modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50";
  const createLayout = async () => {
    try {
      const stored: StoredCartItem[] = _getStoredItems();
      // placeholder 아이템: 가격/제목은 추후 보강
      const cartItems: CartItem[] = stored.map((s) => ({
        id: s.id,
        title: "…",
        price: s.price ?? 0,
        quantity: s.qty,
        imageUrl: "https://placehold.co/64",
      }));

      const itemsCount = cartItems.reduce((acc, c) => acc + c.quantity, 0);
      const totalPrice = cartItems.reduce((sum, c) => sum + c.price * c.quantity, 0);

      const contentsHtml = itemsCount === 0 ? 장바구니_빈컨텐츠 : 장바구니_아이템리스트(cartItems);

      const footerHtml =
        itemsCount === 0
          ? ""
          : `
        <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <div class="flex justify-between items-center mb-4">
            <span class="text-lg font-bold text-gray-900">총 금액</span>
            <span class="text-xl font-bold text-blue-600">${totalPrice.toLocaleString()}원</span>
          </div>
          <div class="space-y-2">
            <div class="flex gap-2">
              <button id="cart-modal-clear-cart-btn" class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm">전체 비우기</button>
              <button id="cart-modal-checkout-btn" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm">구매하기</button>
            </div>
          </div>
        </div>`;

      const countSpan = itemsCount === 0 ? "" : `(${itemsCount})`;

      return `
    <div class="flex min-h-full w-full px-4 items-end justify-center p-0 sm:items-center sm:p-4">
      <div class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
        <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6" />
            </svg>
            장바구니 <span class="text-sm font-normal text-gray-600 ml-1">${countSpan}</span>
          </h2>
          <button id="cart-modal-close-btn" class="text-gray-400 hover:text-gray-600 p-1" aria-label="close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto">${contentsHtml}</div>
        ${footerHtml}
      </div>
    </div>`;
    } catch (err) {
      console.error(err);
      return `<div class="flex items-center justify-center py-20 text-red-500 text-sm bg-white rounded-lg">장바구니 정보를 불러오는데 실패했습니다.</div>`;
    }
  };

  overlay.innerHTML = await createLayout();
  const rootEl = document.getElementById("root") ?? document.body;
  rootEl.appendChild(overlay);

  const closeBtnEl = overlay.querySelector<HTMLButtonElement>("#cart-modal-close-btn");
  const cleanup = () => {
    overlay.remove();
    window.removeEventListener("keydown", handleEsc);
  };

  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") cleanup();
  };

  if (closeBtnEl) closeBtnEl.addEventListener("click", cleanup);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) cleanup();
  });
  window.addEventListener("keydown", handleEsc);

  // ---- 수량 증감 로직 ----
  const recalc = () => {
    const cartItemEls = overlay.querySelectorAll<HTMLElement>(".cart-item");
    let qtySum = 0;
    let priceSum = 0;
    const stored: StoredCartItem[] = [];

    cartItemEls.forEach((el) => {
      const id = el.dataset.productId ?? "";
      const unitPrice = Number(el.dataset.unitPrice ?? 0);
      const input = el.querySelector<HTMLInputElement>(".quantity-input");
      const qty = Number(input?.value ?? 1);
      qtySum += qty;
      priceSum += qty * unitPrice;
      stored.push({ id, qty, price: unitPrice });

      // 소계 갱신
      const subtotal = el.querySelector<HTMLParagraphElement>(".text-right p");
      if (subtotal) subtotal.textContent = `${(unitPrice * qty).toLocaleString()}원`;
    });

    // 로컬스토리지 동기화
    setCartItems(stored);

    // 헤더 배지
    const badgeEl = overlay.querySelector<HTMLSpanElement>("h2 span.text-sm");
    if (badgeEl) badgeEl.textContent = qtySum ? `(${qtySum})` : "";

    // 총액 및 footer 표시
    const totalEl = overlay.querySelector<HTMLSpanElement>(".text-xl.font-bold.text-blue-600");
    const footerEl = overlay.querySelector<HTMLElement>(".sticky.bottom-0");
    if (qtySum === 0) {
      if (footerEl) footerEl.style.display = "none";
    } else {
      if (totalEl) totalEl.textContent = `${priceSum.toLocaleString()}원`;
      if (footerEl) footerEl.style.display = "block";
    }
  };

  const handleQtyChange = (btn: HTMLElement, delta: number) => {
    const itemEl = btn.closest(".cart-item");
    if (!itemEl) return;
    const input = itemEl.querySelector<HTMLInputElement>(".quantity-input");
    if (!input) return;
    let qty = Number(input.value) || 1;
    qty = Math.max(1, qty + delta);
    input.value = String(qty);
    recalc();
  };

  overlay.addEventListener("click", (e) => {
    const incBtn = (e.target as HTMLElement).closest(".quantity-increase-btn");
    if (incBtn) {
      handleQtyChange(incBtn as HTMLElement, 1);
      return;
    }
    const decBtn = (e.target as HTMLElement).closest(".quantity-decrease-btn");
    if (decBtn) {
      handleQtyChange(decBtn as HTMLElement, -1);
    }
  });

  // 상세 정보 보강: 가격/제목 업데이트 후 recalc 호출
  const enrichDetails = async () => {
    const stored = _getStoredItems();
    if (!stored.length) return;
    try {
      const infos = await Promise.all(stored.map((s) => getProduct(s.id)));
      stored.forEach((item) => {
        const info = infos.find((p) => p.productId === item.id);
        if (!info) return;
        const itemEl = overlay.querySelector<HTMLElement>(`.cart-item[data-product-id="${item.id}"]`);
        if (!itemEl) return;
        itemEl.dataset.unitPrice = String(info.lprice ?? 0);
        const titleEl = itemEl.querySelector<HTMLElement>(".cart-item-title");
        if (titleEl) titleEl.textContent = info.title ?? "상품명";
        const priceLabel = itemEl.querySelector<HTMLElement>("p.text-sm.text-gray-600");
        if (priceLabel) priceLabel.textContent = `${Number(info.lprice ?? 0).toLocaleString()}원`;
        const img = itemEl.querySelector<HTMLImageElement>("img");
        if (img && info.image) img.src = info.image;
      });
      recalc();
    } catch (e) {
      console.error(e);
    }
  };

  enrichDetails();
}
