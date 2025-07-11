import { cartStore } from "../../stores/cart-store.ts";
import type { CartItem } from "../../types/cart.ts";
import { getProduct } from "../../api/productApi.js";
import { 장바구니_빈컨텐츠, 장바구니_아이템리스트 } from "./cart-body.ts";
import { 장바구니_정산 } from "./cart-footer.ts";
import { 장바구니_전체선택 } from "./cart-select-section.ts";
import { 토스트 } from "../toast/index.ts";

export async function 장바구니() {
  if (document.querySelector(".cart-modal-overlay")) return;

  const overlay = document.createElement("div");
  overlay.className = "cart-modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50";
  const createLayout = async () => {
    try {
      const stored: CartItem[] = cartStore.getItems();
      // placeholder 아이템: 가격/제목은 추후 보강
      const cartItems: CartItem[] = stored.map((s) => ({
        id: s.id,
        title: s.title ?? "상품명",
        price: s.price ?? 0,
        qty: s.qty,
        imageUrl: "https://placehold.co/64",
      }));

      const itemsCount = cartItems.reduce((acc, c) => acc + c.qty, 0);
      const totalPrice = cartItems.reduce((sum, c) => sum + (c.price ?? 0) * c.qty, 0);

      const contentsHtml = itemsCount === 0 ? 장바구니_빈컨텐츠 : 장바구니_아이템리스트(cartItems);

      const footerHtml = itemsCount === 0 ? "" : 장바구니_정산(totalPrice);

      const countSpan = itemsCount === 0 ? "" : `(${itemsCount})`;

      return `
    <div class="flex min-h-full w-full px-4 items-end justify-center p-0 sm:items-center sm:p-4">
      <div class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden cart-modal">
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
        ${itemsCount === 0 ? "" : 장바구니_전체선택(itemsCount)}
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
  const rootEl = document.getElementById("root");
  rootEl?.appendChild(overlay);

  const closeBtnEl = overlay.querySelector<HTMLButtonElement>("#cart-modal-close-btn");
  // 모달과 관련된 리스너/DOM 요소를 제거하는 헬퍼
  const removeModal = () => {
    overlay.remove();
    window.removeEventListener("keydown", handleEsc);
  };

  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") removeModal();
  };

  if (closeBtnEl) closeBtnEl.addEventListener("click", removeModal);
  // 오버레이 바깥 영역 클릭 -> 모달 닫기
  overlay.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    // 클릭한 요소가 .cart-modal 안에 포함되지 않았다면 오버레이 영역으로 간주함
    if (!target.closest(".cart-modal")) {
      removeModal();
      return;
    }
  });
  window.addEventListener("keydown", handleEsc);

  // ---- 수량 증감/재계산 로직 ----
  // recalc & updateSelectionUI 정의는 아래에 위치

  function recalc() {
    const cartItemEls = overlay.querySelectorAll<HTMLElement>(".cart-item");
    let qtySum = 0;
    let priceSum = 0;
    const stored: CartItem[] = [];
    cartItemEls.forEach((itemEl) => {
      const unitPrice = Number(itemEl.dataset.unitPrice ?? 0);
      const qtyInput = itemEl.querySelector<HTMLInputElement>(".quantity-input");
      const qty = Number(qtyInput?.value ?? 1);
      qtySum += qty;
      priceSum += unitPrice * qty;

      const titleText = itemEl.querySelector<HTMLElement>(".cart-item-title")?.textContent ?? "";
      stored.push({ id: itemEl.dataset.productId ?? "", qty, price: unitPrice, title: titleText });

      // 소계 갱신
      const subtotal = itemEl.querySelector<HTMLParagraphElement>(".text-right p");
      if (subtotal) subtotal.textContent = `${(unitPrice * qty).toLocaleString()}원`;
    });

    // 상태 동기화 (스토어 내부에서 localStorage persist)
    cartStore.setItems(stored);

    // 헤더 배지
    const badgeEl = overlay.querySelector<HTMLSpanElement>("h2 span.text-sm");
    if (badgeEl) badgeEl.textContent = qtySum ? `(${qtySum})` : "";

    // 총액 및 footer 표시
    const totalEl = overlay.querySelector<HTMLSpanElement>(".text-xl.font-bold.text-blue-600");
    const footerEl = overlay.querySelector<HTMLElement>(".sticky.bottom-0");

    if (qtySum === 0) {
      footerEl && (footerEl.style.display = "none");
    } else {
      totalEl && (totalEl.textContent = `${priceSum.toLocaleString()}원`);
      footerEl && (footerEl.style.display = "block");
    }

    const globalBadge = document.querySelector<HTMLSpanElement>("#cart-icon-btn span");
    if (qtySum === 0) {
      globalBadge?.remove();
    } else {
      globalBadge && (globalBadge.textContent = String(qtySum));
    }

    updateSelectionUI();
  }

  function updateSelectionUI() {
    const label = overlay.querySelector<HTMLSpanElement>("#cart-modal-select-all-label");
    const itemsCnt = overlay.querySelectorAll<HTMLInputElement>(".cart-item-checkbox").length;
    const checkedCnt = overlay.querySelectorAll<HTMLInputElement>(".cart-item-checkbox:checked").length;

    label && (label.textContent = `전체선택 (${itemsCnt}개)`);

    const section = overlay.querySelector<HTMLElement>("#cart-modal-select-section");
    section && (section.style.display = itemsCnt === 0 ? "none" : "flex");

    const master = overlay.querySelector<HTMLInputElement>("#cart-modal-select-all-checkbox");
    if (master) master.checked = itemsCnt === checkedCnt;

    const selectedInfo = overlay.querySelector<HTMLElement>("#cart-modal-selected-info");
    const removeSelectedBtn = overlay.querySelector<HTMLButtonElement>("#cart-modal-remove-selected-btn");

    if (selectedInfo && removeSelectedBtn) {
      let selectedPrice = 0;
      overlay.querySelectorAll<HTMLInputElement>(".cart-item-checkbox:checked").forEach((cb) => {
        const itemEl = cb.closest<HTMLElement>(".cart-item");
        if (itemEl) {
          const unitPrice = Number(itemEl.dataset.unitPrice ?? 0);
          const input = itemEl.querySelector<HTMLInputElement>(".quantity-input");
          const qty = Number(input?.value ?? 1);
          selectedPrice += unitPrice * qty;
        }
      });

      selectedInfo.querySelector<HTMLSpanElement>(".text-gray-600")!.textContent = `선택한 상품 (${checkedCnt}개)`;
      selectedInfo.querySelector<HTMLSpanElement>(".font-medium")!.textContent = `${selectedPrice.toLocaleString()}원`;
      removeSelectedBtn.textContent = `선택한 상품 삭제 (${checkedCnt}개)`;
    }
  }

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
      return;
    }

    // ----- 단일 항목 삭제 -----
    const removeBtn = (e.target as HTMLElement).closest(".cart-item-remove-btn");
    if (removeBtn) {
      const itemEl = removeBtn.closest<HTMLElement>(".cart-item");
      if (itemEl) {
        itemEl.remove();
        토스트("상품이 삭제되었습니다", "info");
      }
      recalc();

      // 모든 아이템 삭제된 경우 빈 컨텐츠 표시
      if (!overlay.querySelector(".cart-item")) {
        const listContainer = overlay.querySelector(".flex-1");
        if (listContainer) listContainer.innerHTML = 장바구니_빈컨텐츠;
      }
      return;
    }

    // 선택 삭제 버튼
    const selDelBtn = (e.target as HTMLElement).closest("#cart-modal-remove-selected-btn");
    if (selDelBtn) {
      const checkedItems = overlay.querySelectorAll<HTMLInputElement>(".cart-item-checkbox:checked");
      const selectedCount = checkedItems.length;

      if (selectedCount > 0) {
        checkedItems.forEach((cb) => cb.closest<HTMLElement>(".cart-item")?.remove());
        토스트("선택된 상품들이 삭제되었습니다", "info");
        recalc();
        updateSelectionUI();
        if (!overlay.querySelector(".cart-item")) {
          const listContainer = overlay.querySelector(".flex-1");
          if (listContainer) listContainer.innerHTML = 장바구니_빈컨텐츠;
        }
      }
      return;
    }

    // 전체 삭제 버튼
    const clearBtn = (e.target as HTMLElement).closest("#cart-modal-clear-cart-btn");
    if (clearBtn) {
      const allItems = overlay.querySelectorAll<HTMLElement>(".cart-item");
      if (allItems.length > 0) {
        allItems.forEach((item) => item.remove());
        recalc();

        const listContainer = overlay.querySelector(".flex-1");
        if (listContainer) listContainer.innerHTML = 장바구니_빈컨텐츠;
      }
      return;
    }
  });

  // change 이벤트 처리(체크박스)
  overlay.addEventListener("change", (e) => {
    const el = e.target as HTMLInputElement;

    // 마스터 체크박스 토글 → 모든 개별 체크박스 동기화
    if (el.id === "cart-modal-select-all-checkbox") {
      overlay.querySelectorAll<HTMLInputElement>(".cart-item-checkbox").forEach((cb) => (cb.checked = el.checked));
    }

    // (개별 또는 마스터) 체크박스 변경 후 UI 갱신
    if (el.id === "cart-modal-select-all-checkbox" || el.classList.contains("cart-item-checkbox")) {
      updateSelectionUI();
    }
  });

  // 상세 정보 보강: 가격/제목 업데이트 후 recalc 호출
  const enrichDetails = async () => {
    const stored = cartStore.getItems();
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
      // test 환경에서 afterEach로 로컬스토리지 클리어를 한다해도, fetch가 recalc를 다시 호출해서 발생하는 수량누적을 가드함
      if (!overlay.isConnected) return;
      recalc();
    } catch (e) {
      console.error(e);
    }
  };

  enrichDetails();
}
