import { store } from "../store.js";
import { actions } from "../actions/index.js";

export class CartController {
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

    store.dispatch(actions.updateCartQuantity(productId, currentQuantity + 1));
  }

  #handleDecreaseQuantity(event) {
    const decreaseButton = event.target.closest(".quantity-decrease-btn");
    if (!decreaseButton) return;

    const productId = decreaseButton.dataset.productId;
    if (!productId) return;

    const cartItem = this.state.cart.items.find((item) => item.productId === productId);
    if (!cartItem) return;

    store.dispatch(actions.updateCartQuantity(productId, cartItem.quantity - 1));
  }

  cleanup() {
    this.#eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.#eventListeners = [];
  }
}
