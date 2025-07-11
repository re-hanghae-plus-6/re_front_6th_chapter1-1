import { CartModal } from "../components/cart/CartModal.js";
import { cartStore, SHOPPING_CART_KEY } from "../store/cart.js";
import { setToLocalStorage } from "../utils/localStorage.js";

export class CartModalController {
  constructor() {
    this.modalContainer = null;
    this.unsubscribe = null;
    this.init();
  }

  init() {
    this.createModalContainer();
    this.setupEventListeners();
    this.subscribeToStore();

    setTimeout(() => {
      this.updateCartBadge(cartStore.getState());
    }, 100);
  }

  createModalContainer() {
    if (!this.modalContainer) {
      this.modalContainer = document.createElement("div");
      this.modalContainer.id = "cart-modal-container";
      this.modalContainer.className = "fixed inset-0 z-50 hidden";
      document.body.appendChild(this.modalContainer);
    }
  }

  setupEventListeners() {
    document.addEventListener("click", (e) => {
      if (e.target.closest("#cart-icon-btn")) {
        this.openModal();
      }
    });

    // 모달 닫기 이벤트들
    document.addEventListener("click", (e) => {
      // 모달 닫기 버튼 클릭
      if (e.target.closest("#cart-modal-close-btn")) {
        this.closeModal();
      }

      if (e.target.id === "cart-modal-container") {
        this.closeModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isModalOpen()) {
        this.closeModal();
      }
    });
  }

  subscribeToStore() {
    this.unsubscribe = cartStore.subscribe((state) => {
      this.render(state);
      this.updateCartBadge(state);
    });
  }

  updateCartBadge(state) {
    const cartIconBtn = document.querySelector("#cart-icon-btn");
    if (cartIconBtn) {
      const cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0);

      const existingBadge = cartIconBtn.querySelector(".cart-badge");
      if (existingBadge) {
        existingBadge.remove();
      }

      if (cartItemCount > 0) {
        const badge = document.createElement("span");
        badge.className =
          "cart-badge absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center";
        badge.textContent = cartItemCount > 99 ? "99+" : cartItemCount;
        cartIconBtn.appendChild(badge);
      }
    }
  }

  openModal() {
    const currentState = cartStore.getState();
    cartStore.setState({
      ...currentState,
      isModalOpen: true,
    });
    this.saveToLocalStorage();
  }

  closeModal() {
    const currentState = cartStore.getState();
    cartStore.setState({
      ...currentState,
      isModalOpen: false,
    });
    this.saveToLocalStorage();
  }

  isModalOpen() {
    return cartStore.getState().isModalOpen;
  }

  render(state) {
    const { isModalOpen, items, selectedItems } = state;

    if (isModalOpen) {
      this.modalContainer.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity">
          ${CartModal({ items, selectedItems })}
        </div>
      `;
      this.modalContainer.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    } else {
      this.modalContainer.classList.add("hidden");
      this.modalContainer.innerHTML = "";
      document.body.style.overflow = "";
    }
  }

  saveToLocalStorage() {
    const state = cartStore.getState();
    setToLocalStorage(SHOPPING_CART_KEY, state);
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.modalContainer) {
      this.modalContainer.remove();
    }
    document.body.style.overflow = "";
  }
}
