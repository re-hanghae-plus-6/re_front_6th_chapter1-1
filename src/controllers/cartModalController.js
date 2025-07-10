import { store } from "../store.js";
import { actions } from "../actions/index.js";

export class CartModalController {
  #eventListeners = [];

  constructor() {
    this.#setupEventListeners();
  }

  get state() {
    return store.getState();
  }

  #setupEventListeners() {
    const clickHandler = (event) => {
      if (event.target.closest(".quantity-increase-btn")) {
        this.#handleIncreaseQuantity(event);
        return;
      }

      if (event.target.closest(".quantity-decrease-btn")) {
        this.#handleDecreaseQuantity(event);
        return;
      }

      if (event.target.closest(".cart-item-remove-btn")) {
        this.#handleRemoveItem(event);
        return;
      }

      if (event.target.closest(".cart-item-checkbox")) {
        this.#handleItemSelection(event);
        return;
      }

      if (event.target.id === "cart-modal-select-all-checkbox") {
        this.#handleSelectAll(event);
        return;
      }

      if (event.target.id === "cart-modal-remove-selected-btn") {
        this.#handleRemoveSelected(event);
        return;
      }

      if (event.target.id === "cart-modal-clear-cart-btn") {
        this.#handleClearCart(event);
        return;
      }
    };

    document.addEventListener("click", clickHandler);
    this.#eventListeners.push({ element: document, type: "click", handler: clickHandler });
  }

  #handleIncreaseQuantity(event) {
    const increaseButton = event.target.closest(".quantity-increase-btn");
    if (!increaseButton) return;

    const productId = increaseButton.dataset.productId;
    if (!productId) return;

    const cartItem = this.state.cart.items.find((item) => item.productId === productId);
    const currentQuantity = cartItem ? cartItem.quantity : 0;
    const newQuantity = currentQuantity + 1;

    const previousValues = {
      quantity: currentQuantity,
      price: cartItem && cartItem.product ? cartItem.product.lprice * currentQuantity : 0,
    };

    const quantityInput = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
    const priceElement = document.querySelector(
      `.cart-item[data-product-id="${productId}"] .text-right p.text-sm.font-medium`,
    );

    if (quantityInput) {
      quantityInput.value = newQuantity;
    }

    if (priceElement && cartItem && cartItem.product) {
      priceElement.textContent = `${(cartItem.product.lprice * newQuantity).toLocaleString()}원`;
    }

    try {
      store.dispatch(actions.updateCartQuantity(productId, newQuantity));
    } catch (error) {
      console.error("수량 업데이트 실패:", error);

      if (quantityInput) {
        quantityInput.value = previousValues.quantity;
      }

      if (priceElement) {
        priceElement.textContent = `${previousValues.price.toLocaleString()}원`;
      }
    }
  }

  #handleDecreaseQuantity(event) {
    const decreaseButton = event.target.closest(".quantity-decrease-btn");
    if (!decreaseButton) return;

    const productId = decreaseButton.getAttribute("data-product-id");
    if (!productId) return;

    const cartItem = this.state.cart.items.find((item) => item.productId === productId);
    if (!cartItem) return;

    const currentQuantity = cartItem.quantity;
    const newQuantity = currentQuantity - 1;

    const previousValues = {
      quantity: currentQuantity,
      price: cartItem && cartItem.product ? cartItem.product.lprice * currentQuantity : 0,
    };

    if (newQuantity > 0) {
      const quantityInput = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
      const priceElement = document.querySelector(
        `.cart-item[data-product-id="${productId}"] .text-right p.text-sm.font-medium`,
      );

      if (quantityInput) {
        quantityInput.value = newQuantity;
      }

      if (priceElement && cartItem.product) {
        priceElement.textContent = `${(cartItem.product.lprice * newQuantity).toLocaleString()}원`;
      }

      try {
        store.dispatch(actions.updateCartQuantity(productId, newQuantity));
      } catch (error) {
        console.error("수량 업데이트 실패:", error);

        if (quantityInput) {
          quantityInput.value = previousValues.quantity;
        }

        if (priceElement) {
          priceElement.textContent = `${previousValues.price.toLocaleString()}원`;
        }
      }
    } else {
      try {
        store.dispatch(actions.updateCartQuantity(productId, newQuantity));
      } catch (error) {
        console.error("아이템 제거 실패:", error);
      }
    }
  }

  #handleRemoveItem(event) {
    const removeButton = event.target.closest(".cart-item-remove-btn");
    if (!removeButton) return;

    const productId = removeButton.getAttribute("data-product-id");
    if (!productId) return;

    store.dispatch(actions.removeFromCart(productId));
  }

  #handleItemSelection(event) {
    const checkbox = event.target.closest(".cart-item-checkbox");
    if (!checkbox) return;

    const productId = checkbox.getAttribute("data-product-id");
    if (!productId) return;

    store.dispatch(actions.toggleCartItemSelection(productId));
  }

  #handleSelectAll(event) {
    const selectAllCheckbox = event.target;
    const isChecked = selectAllCheckbox.checked;

    store.dispatch(actions.toggleAllCartItems(isChecked));
  }

  #handleRemoveSelected() {
    store.dispatch(actions.removeSelectedItems());
  }

  #handleClearCart() {
    store.dispatch(actions.clearCart());
  }

  cleanup() {
    this.#eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.#eventListeners = [];
  }
}
