import { CartUI } from "../views/CartUI.js";
import { cartStore } from "../store/cartStore.js";

export const cartModal = ({ state, setState }) => {
  let modal = null;

  // 장바구니 모달 업데이트
  function renderCartModal() {
    if (!modal) return;
    // 모달 내용을 새로운 cart 데이터로 업데이트
    modal.innerHTML = CartUI(state.cart);
    // 이벤트 다시 바인딩
    bindCartModalEvents();
  }
  // quantity-input 요소들의 value를 cart 데이터에 맞춰 업데이트
  function updateQuantityInputs() {
    const quantityInputs = document.querySelectorAll(".quantity-input");
    quantityInputs.forEach((input) => {
      const productId = input.getAttribute("data-product-id");
      const cartItem = state.cart.find((item) => item.productId === productId);
      if (cartItem) {
        input.value = cartItem.quantity;
      } else {
        input.value = 0;
      }
    });
  }

  // 장바구니에 상품 추가
  function addToCart({ product, addQuantity = 1 }) {
    cartStore.actions.addToCart(cartStore.state, product, addQuantity);
    updateQuantityInputs();
    setState({ cart: cartStore.state.cart });
    // 장바구니 아이콘의 숫자 업데이트
    // page.render();
  }

  // 장바구니 모달 표시
  function openCartModal() {
    // 기존 모달이 있다면 제거
    const existingModal = document.getElementById("modal-root");
    if (existingModal) {
      existingModal.remove();
    }
    modal = document.createElement("div");
    modal.id = "modal-root";
    // 스크롤 막기
    document.body.style.overflow = "hidden";

    renderCartModal();
    // 모달을 body에 추가
    document.body.appendChild(modal);

    // 모달 닫기 함수
    const closeModal = () => {
      modal.remove();
      // 스크롤 다시 활성화
      document.body.style.overflow = "";
    };

    // 닫기 버튼 이벤트
    const closeBtn = modal.querySelector("#cart-modal-close-btn");
    closeBtn.onclick = closeModal;

    // 모달 외부 클릭 시 닫기
    modal.onclick = (e) => {
      if (e.target === modal.querySelector(".cart-modal-overlay")) {
        closeModal();
      }
    };

    // ESC 키로 닫기
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", handleEsc);
      }
    };
    document.addEventListener("keydown", handleEsc);
  }

  // 장바구니 모달 내부 이벤트 바인딩
  function bindCartModalEvents() {
    // 수량 증가 버튼
    const increaseButtons = modal.querySelectorAll(".quantity-increase-btn");
    increaseButtons.forEach((button) => {
      button.onclick = (e) => {
        const productId = e.target.closest("button").getAttribute("data-product-id");
        updateQuantityInputs();
        updateCartItemQuantity(productId, 1);
        // renderCartModal();
      };
    });

    // 수량 감소 버튼
    const decreaseButtons = modal.querySelectorAll(".quantity-decrease-btn");
    decreaseButtons.forEach((button) => {
      button.onclick = (e) => {
        const productId = e.target.closest("button").getAttribute("data-product-id");

        updateQuantityInputs();
        updateCartItemQuantity(productId, -1);
        // renderCartModal();
      };
    });

    // 삭제 버튼
    const removeButtons = modal.querySelectorAll(".cart-item-remove-btn");
    removeButtons.forEach((button) => {
      button.onclick = (e) => {
        const productId = e.target.getAttribute("data-product-id");
        removeFromCart(productId);
        // renderCartModal();
      };
    });

    // 상품 선택 체크박스
    const checkboxes = modal.querySelectorAll(".cart-item-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.onclick = (e) => {
        const productId = e.target.getAttribute("data-product-id");
        const isChecked = e.target.checked;
        const newCart = state.cart.map((item) => {
          if (item.productId === productId) {
            item.isChecked = isChecked;
          }
          return item;
        });
        setState({ cart: newCart });

        // renderCartModal();
      };
    });

    // 선택한 상품 삭제 버튼
    const removeSelectedBtn = modal.querySelector("#cart-modal-remove-selected-btn");
    removeSelectedBtn.onclick = () => {
      // 체크된 체크박스의 productId 수집
      const checkedBoxes = document.querySelectorAll(".cart-item-checkbox:checked");
      const selectedIds = Array.from(checkedBoxes).map((cb) => cb.dataset.productId);
      selectedIds.forEach((id) => removeFromCart(id));
      // renderCartModal();
    };

    //전체 선택 버튼
    const selectAllCheckbox = modal.querySelector("#cart-modal-select-all-checkbox");
    selectAllCheckbox.onclick = (e) => {
      const isChecked = e.target.checked;
      const newCart = state.cart.map((item) => {
        item.isChecked = isChecked;
        return item;
      });
      setState({ cart: newCart });
      // renderCartModal();
    };
    // 비우기 버튼
    const clearCartBtn = modal.querySelector("#cart-modal-clear-cart-btn");
    clearCartBtn.onclick = () => {
      removeAllFromCart();
      // renderCartModal();
    };
  }

  // 장바구니 아이템 수량 업데이트
  function updateCartItemQuantity(productId, change) {
    cartStore.actions.updateCartItemQuantity(cartStore.state, productId, change);

    setState({ cart: cartStore.state.cart });

    // 장바구니 아이콘 업데이트
    // renderAndBindEvents(ProductListPage(state));
  }

  // 장바구니에서 아이템 제거
  function removeFromCart(productId) {
    cartStore.actions.removeFromCart(cartStore.state, productId);
    setState({ cart: cartStore.state.cart });
    // renderAndBindEvents(ProductListPage(state));
  }
  //장바구니 비우기
  function removeAllFromCart() {
    cartStore.actions.removeAllFromCart(cartStore.state);
    setState({ cart: cartStore.state.cart });
    // renderAndBindEvents(ProductListPage(state));
  }

  // return CartUI(cart);
  return { openCartModal, updateQuantityInputs, addToCart, renderCartModal };
};
