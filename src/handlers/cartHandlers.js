import mainStore from "../store/main.js";
import { render } from "../core/renderer.js";
import { updateCartQuantity, removeFromCart } from "../utils/cart.js";

// 장바구니 다이얼로그 내에서의 이벤트 핸들러들
export const handleCartQuantityChange = (e) => {
  if (!e.target.classList.contains("quantity-input")) return;

  const productId = e.target.dataset.productId;
  const newQuantity = parseInt(e.target.value);

  if (productId && newQuantity > 0) {
    updateCartQuantity(productId, newQuantity);
    render();
  }
};

export const handleQuantityIncrease = (e) => {
  if (!e.target.classList.contains("quantity-increase-btn")) return;

  const productId = e.target.dataset.productId;
  const quantityInput = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);

  if (quantityInput) {
    const currentQuantity = parseInt(quantityInput.value);
    updateCartQuantity(productId, currentQuantity + 1);
    render();
  }
};

export const handleQuantityDecrease = (e) => {
  if (!e.target.classList.contains("quantity-decrease-btn")) return;

  const productId = e.target.dataset.productId;
  const quantityInput = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);

  if (quantityInput) {
    const currentQuantity = parseInt(quantityInput.value);
    if (currentQuantity > 1) {
      updateCartQuantity(productId, currentQuantity - 1);
      render();
    }
  }
};

export const handleRemoveFromCart = (e) => {
  if (!e.target.classList.contains("cart-item-remove-btn")) return;

  const productId = e.target.dataset.productId;

  if (productId) {
    removeFromCart(productId);
    render();
  }
};

export const handleOpenCartDialog = () => {
  mainStore.openCart();
  render();
};
