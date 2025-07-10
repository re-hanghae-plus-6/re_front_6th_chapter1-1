import { state } from "../main.js";

export function closeCartModal({ modalClickHandler, modalKeydownHandler }) {
  const modal = document.querySelector(".cart-modal");
  if (modal) {
    modal.remove();

    // 이벤트 리스너 정리
    if (modalClickHandler) {
      document.removeEventListener("click", modalClickHandler);
    }
    if (modalKeydownHandler) {
      document.removeEventListener("keydown", modalKeydownHandler);
    }
  }
}

export function removeFromCart(productId, { renderCartModal, showToast }) {
  // 해당 상품의 첫 번째 인스턴스만 제거
  const index = state.cart.findIndex((item) => item.productId === productId);

  if (index !== -1) {
    state.cart.splice(index, 1);
    // 선택된 아이템에서도 제거
    state.selectedCartItems = state.selectedCartItems.filter((id) => id !== productId);

    // 모달이 열려있다면 모달만 다시 렌더링
    if (document.querySelector(".cart-modal")) {
      renderCartModal();
    }

    showToast({ type: "delete" });
  }
}

export function toggleCartItemSelection(productId, { renderCartModal }) {
  const index = state.selectedCartItems.indexOf(productId);

  if (index === -1) {
    // 선택되지 않았다면 추가
    state.selectedCartItems.push(productId);
  } else {
    // 이미 선택되었다면 제거
    state.selectedCartItems.splice(index, 1);
  }

  // 모달만 다시 렌더링
  if (document.querySelector(".cart-modal")) {
    renderCartModal();
  }
}
