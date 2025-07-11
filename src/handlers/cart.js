import { CartModal } from "../components/CartModal.js";
import { saveCartToStorage } from "../utils/cartStorage.js";

// 총 금액을 계산하고 DOM에 업데이트하는 함수
function updateTotalPrice(state) {
  const cartItemsWithCount = state.cart.reduce((acc, product) => {
    const existingItem = acc.find((item) => item.productId === product.productId);
    if (existingItem) {
      existingItem.count++;
    } else {
      acc.push({ ...product, count: 1 });
    }
    return acc;
  }, []);

  const totalPrice = cartItemsWithCount.reduce((sum, item) => sum + Number(item.lprice) * item.count, 0);

  // DOM에서 총 금액 업데이트
  const totalPriceElement = document.querySelector(".text-xl.font-bold.text-blue-600");
  if (totalPriceElement) {
    totalPriceElement.textContent = `${totalPrice.toLocaleString()}원`;
  }
}

// 헤더의 장바구니 카운트를 업데이트하는 함수
function updateCartCount(state) {
  const cartCountElement = document.querySelector("#cart-icon-btn span");

  if (state.cart.length > 0) {
    if (cartCountElement) {
      cartCountElement.textContent = state.cart.length;
    } else {
      // 카운트 요소가 없으면 생성
      const cartButton = document.querySelector("#cart-icon-btn");
      if (cartButton) {
        const countSpan = document.createElement("span");
        countSpan.className =
          "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center";
        countSpan.textContent = state.cart.length;
        cartButton.appendChild(countSpan);
      }
    }
  } else {
    // 장바구니가 비어있으면 카운트 요소 제거
    if (cartCountElement) {
      cartCountElement.remove();
    }
  }
}

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

    // localStorage에 저장 (테스트 환경이 아닌 경우에만)
    if (import.meta.env.MODE !== "test") {
      saveCartToStorage(state.cart, state.selectedCartItems);
    }

    // 헤더의 장바구니 카운트 업데이트
    updateCartCount(state);

    // 모달이 열려있다면 모달만 다시 렌더링
    if (document.querySelector(".cart-modal")) {
      renderCartModal(state, showToast);
    }

    showToast({ type: "delete" });
  }
}

export function increaseCartItemQuantity(productId, state) {
  // 해당 상품을 장바구니에 추가 (동일한 상품 추가)
  const product = state.cart.find((item) => item.productId === productId);
  if (product) {
    state.cart.push({ ...product });

    // localStorage에 저장 (테스트 환경이 아닌 경우에만)
    if (import.meta.env.MODE !== "test") {
      saveCartToStorage(state.cart, state.selectedCartItems);
    }

    // DOM에서 해당 상품의 수량과 가격을 직접 업데이트
    const quantityInput = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
    if (quantityInput) {
      const newQuantity = parseInt(quantityInput.value) + 1;
      quantityInput.value = newQuantity;

      // 해당 상품의 가격도 업데이트
      const cartItem = quantityInput.closest(".cart-item");
      const priceElement = cartItem.querySelector(".text-right .text-sm.font-medium");
      if (priceElement) {
        const unitPrice = parseInt(product.lprice);
        priceElement.textContent = `${(unitPrice * newQuantity).toLocaleString()}원`;
      }

      // 총 금액 업데이트
      updateTotalPrice(state);

      // 헤더의 장바구니 카운트 업데이트
      updateCartCount(state);
    }
  }
}

export function decreaseCartItemQuantity(productId, state, { renderCartModal, showToast }) {
  // 해당 상품의 수량을 하나 감소 (첫 번째 인스턴스 제거)
  const index = state.cart.findIndex((item) => item.productId === productId);

  if (index !== -1) {
    const product = state.cart[index];
    state.cart.splice(index, 1);

    // localStorage에 저장 (테스트 환경이 아닌 경우에만)
    if (import.meta.env.MODE !== "test") {
      saveCartToStorage(state.cart, state.selectedCartItems);
    }

    // DOM에서 해당 상품의 수량과 가격을 직접 업데이트
    const quantityInput = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
    if (quantityInput) {
      const newQuantity = parseInt(quantityInput.value) - 1;

      if (newQuantity > 0) {
        quantityInput.value = newQuantity;

        // 해당 상품의 가격도 업데이트
        const cartItem = quantityInput.closest(".cart-item");
        const priceElement = cartItem.querySelector(".text-right .text-sm.font-medium");
        if (priceElement) {
          const unitPrice = parseInt(product.lprice);
          priceElement.textContent = `${(unitPrice * newQuantity).toLocaleString()}원`;
        }

        // 총 금액 업데이트
        updateTotalPrice(state);

        // 헤더의 장바구니 카운트 업데이트
        updateCartCount(state);
      } else {
        // 수량이 0이 되면 전체 모달 다시 렌더링 (상품 제거)
        renderCartModal(state, showToast);
      }
    }
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

  // localStorage에 저장 (테스트 환경이 아닌 경우에만)
  if (import.meta.env.MODE !== "test") {
    saveCartToStorage(state.cart, state.selectedCartItems);
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

      // localStorage에 저장 (테스트 환경이 아닌 경우에만)
      if (import.meta.env.MODE !== "test") {
        saveCartToStorage(state.cart, state.selectedCartItems);
      }

      renderCartModal(state, showToast);
      return;
    }

    /** 수량 조절 이벤트 */
    // 수량 증가 (버튼 또는 내부 SVG 클릭)
    if (event.target.matches(".quantity-increase-btn") || event.target.closest(".quantity-increase-btn")) {
      const button = event.target.matches(".quantity-increase-btn")
        ? event.target
        : event.target.closest(".quantity-increase-btn");
      const productId = button.dataset.productId;
      increaseCartItemQuantity(productId, state);
      return;
    }

    // 수량 감소 (버튼 또는 내부 SVG 클릭)
    if (event.target.matches(".quantity-decrease-btn") || event.target.closest(".quantity-decrease-btn")) {
      const button = event.target.matches(".quantity-decrease-btn")
        ? event.target
        : event.target.closest(".quantity-decrease-btn");
      const productId = button.dataset.productId;
      decreaseCartItemQuantity(productId, state, { renderCartModal, showToast });
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
      const selectedProductIds = [...state.selectedCartItems]; // 복사본 생성

      // 선택된 상품들을 일괄 삭제
      selectedProductIds.forEach((productId) => {
        // 해당 상품의 모든 인스턴스 제거
        state.cart = state.cart.filter((item) => item.productId !== productId);
      });

      // 선택된 아이템 목록 초기화
      state.selectedCartItems = [];

      // localStorage에 저장 (테스트 환경이 아닌 경우에만)
      if (import.meta.env.MODE !== "test") {
        saveCartToStorage(state.cart, state.selectedCartItems);
      }

      // 헤더의 장바구니 카운트 업데이트
      updateCartCount(state);

      // 모달 전체 다시 렌더링
      renderCartModal(state, showToast);
      return;
    }

    // NOTE 전체 삭제
    if (event.target.matches("#cart-modal-clear-cart-btn")) {
      state.cart = [];
      state.selectedCartItems = [];

      // localStorage에 저장 (테스트 환경이 아닌 경우에만)
      if (import.meta.env.MODE !== "test") {
        saveCartToStorage(state.cart, state.selectedCartItems);
      }

      // 헤더의 장바구니 카운트 업데이트
      updateCartCount(state);

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
