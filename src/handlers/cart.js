import { CartModal } from "../components/CartModal.js";

export function renderCartModal(state, showToast) {
  // 기존 이벤트 리스너 정리
  if (modalClickHandler) {
    document.removeEventListener("click", modalClickHandler);
    modalClickHandler = null;
  }
  if (modalKeydownHandler) {
    document.removeEventListener("keydown", modalKeydownHandler);
    modalKeydownHandler = null;
  }

  // 기존 모달 제거
  const existingModal = document.querySelector(".cart-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // 새 모달 생성
  const modalHTML = CartModal({
    cart: state.cart,
    selectedCartItems: state.selectedCartItems,
  });

  document.querySelector("#modal-root").insertAdjacentHTML("beforeend", modalHTML);
  setupModalEvents(state, { renderCartModal, showToast });
}

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

export function removeFromCart(productId, state, { renderCartModal, showToast }) {
  // 해당 상품의 첫 번째 인스턴스만 제거
  const index = state.cart.findIndex((item) => item.productId === productId);

  if (index !== -1) {
    state.cart.splice(index, 1);
    // 선택된 아이템에서도 제거
    state.selectedCartItems = state.selectedCartItems.filter((id) => id !== productId);

    // 모달이 열려있다면 모달만 다시 렌더링
    if (document.querySelector(".cart-modal")) {
      renderCartModal(state, showToast);
    }

    showToast({ type: "delete" });
  }
}

export function toggleCartItemSelection(productId, state, { renderCartModal, showToast }) {
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
    renderCartModal(state, showToast);
  }
}

export function showCartModal(state, { renderCartModal, showToast }) {
  // 이미 모달이 열려있다면 return
  if (document.querySelector(".cart-modal")) {
    return;
  }

  // 컴포넌트를 사용해서 모달 HTML 생성
  const modalHTML = CartModal({
    cart: state.cart,
    selectedCartItems: state.selectedCartItems,
  });

  // DOM에 추가
  document.querySelector("#modal-root").insertAdjacentHTML("beforeend", modalHTML);
  setupModalEvents(state, { renderCartModal, showToast });
}

let modalClickHandler = null;
let modalKeydownHandler = null;

export function setupModalEvents(state, { renderCartModal, showToast }) {
  const modal = document.querySelector(".cart-modal");
  if (!modal) return;

  // 기존 이벤트 리스너 제거
  if (modalClickHandler) {
    document.removeEventListener("click", modalClickHandler);
  }
  if (modalKeydownHandler) {
    document.removeEventListener("keydown", modalKeydownHandler);
  }

  // 새로운 이벤트 리스너 생성
  modalClickHandler = (event) => {
    // 체크박스 클릭
    if (event.target.matches(".cart-item-checkbox")) {
      const productId = event.target.dataset.productId;
      toggleCartItemSelection(productId, state, { renderCartModal, showToast });
      return;
    }

    if (event.target.matches("#cart-modal-select-all-checkbox")) {
      // 현재 전체 선택 상태 확인 (중복 상품 제거한 배열로 확인)
      const uniqueCartItems = [...new Set(state.cart.map((item) => item.productId))];
      const isAllChecked = uniqueCartItems.every((productId) => state.selectedCartItems.includes(productId));

      if (isAllChecked) {
        // 모든 아이템이 선택되어 있다면 전체 해제
        state.selectedCartItems = [];
      } else {
        // 일부만 선택되어 있거나 아무것도 선택되지 않았다면 전체 선택
        state.selectedCartItems = uniqueCartItems;
      }

      renderCartModal(state, showToast);
      return;
    }

    /** 삭제 이벤트 */
    // NOTE 개별 아이템 삭제
    if (event.target.matches(".cart-item-remove-btn")) {
      const productId = event.target.dataset.productId;
      removeFromCart(productId, state, { renderCartModal, showToast });
      return;
    }

    // NOTE 선택 아이템 삭제
    if (event.target.matches("#cart-modal-remove-selected-btn")) {
      const selectedProductIds = state.selectedCartItems;
      selectedProductIds.forEach((productId) => {
        removeFromCart(productId, state, { renderCartModal, showToast });
      });
      return;
    }

    // NOTE 전체 삭제
    if (event.target.matches("#cart-modal-clear-cart-btn")) {
      state.cart = [];
      state.selectedCartItems = [];
      renderCartModal(state, showToast);
      return;
    }

    // 닫기 버튼 클릭 (모든 닫기 버튼 확인)
    const closeButtons = document.querySelectorAll(".modal-close-btn");
    for (const closeBtn of closeButtons) {
      if (event.target === closeBtn || closeBtn.contains(event.target)) {
        closeCartModal({ modalClickHandler, modalKeydownHandler });
        return;
      }
    }

    // 배경 클릭으로 닫기
    if (event.target.matches(".cart-modal-overlay")) {
      closeCartModal({ modalClickHandler, modalKeydownHandler });
    }
  };

  modalKeydownHandler = (event) => {
    if (event.key === "Escape") {
      closeCartModal({ modalClickHandler, modalKeydownHandler });
    }
  };

  // 이벤트 리스너 등록
  document.addEventListener("click", modalClickHandler);
  document.addEventListener("keydown", modalKeydownHandler);
}
