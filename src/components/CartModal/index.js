import { toast } from "../../pages/HomePage/components/Toast";
import { CartStorage } from "../../utils";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import ModalFooter from "./Footer";

export class CartModal {
  constructor({ getState, setState, selector }) {
    this.root = selector;
    this.element = null;
    this.getState = getState;
    this.setState = setState;

    this.boundHandleClick = this.handleClick.bind(this);
    this.boundHandleChange = this.handleChange.bind(this);
    this.boundHandleKeydown = this.handleKeydown.bind(this);
  }

  open() {
    if (this.element) return;
    this.render();
    this.attachEventListeners();

    document.addEventListener("keydown", this.boundHandleKeydown);
  }

  close() {
    if (this.element) {
      this.element.remove();
      this.element = null;
      document.removeEventListener("keydown", this.boundHandleKeydown);
    }
  }

  update() {
    if (!this.element) return;

    const state = this.getState();
    const { cart } = state;

    const container = document.body.querySelector("#modal-container");
    console.log(container);
    if (container) {
      container.innerHTML = createModalInnerHTML({ cart });
    }
  }

  render() {
    this.element = this.createCartModal();
    this.root.appendChild(this.element);
  }

  createCartModal() {
    const state = this.getState();
    const { cart } = state;

    const container = document.createElement("div");
    container.innerHTML = createHTML({ cart });
    return container.firstElementChild;
  }

  handleClick(event) {
    const { target } = event;

    if (target.id === "cart-modal-close-btn" || target.classList.contains("cart-modal-overlay")) {
      this.setState({ cartModalOpen: false });
      return;
    }

    const increaseBtn = target.closest(".quantity-increase-btn");
    if (increaseBtn) {
      this.updateQuantity(increaseBtn.dataset.productId, 1);
      return;
    }

    const decreaseBtn = target.closest(".quantity-decrease-btn");
    if (decreaseBtn) {
      this.updateQuantity(decreaseBtn.dataset.productId, -1);
      return;
    }

    const removeBtn = target.closest(".cart-item-remove-btn");
    if (removeBtn) {
      this.removeItem(removeBtn.dataset.productId);
      return;
    }

    const removeSelectedBtn = target.closest("#cart-modal-remove-selected-btn");
    if (removeSelectedBtn) {
      this.removeSelectedItems();
      return;
    }

    const clearCartBtn = target.closest("#cart-modal-clear-cart-btn");
    if (clearCartBtn) {
      this.clearCart();
      return;
    }

    const cartItemImage = target.closest(".cart-item-image");
    const cartItemTitle = target.closest(".cart-item-title");

    if (cartItemImage || cartItemTitle) {
      const productId = (cartItemImage || cartItemTitle).dataset.productId;
      if (productId) {
        this.setState({ cartModalOpen: false });
        window.history.pushState({}, "", `/product/${productId}`);
        window.dispatchEvent(new Event("popstate"));
      }
      return;
    }
  }

  handleChange(event) {
    const { target } = event;

    if (target.id === "cart-modal-select-all-checkbox") {
      this.toggleSelectAll(target.checked);
      return;
    }

    if (target.classList.contains("cart-item-checkbox")) {
      const productId = target.dataset.productId;
      this.toggleItemSelection(productId, target.checked);
      return;
    }
  }

  handleKeydown(event) {
    if (event.key === "Escape") {
      this.setState({ cartModalOpen: false });
    }
  }

  attachEventListeners() {
    if (!this.element) return;
    this.element.removeEventListener("click", this.boundHandleClick);
    this.element.removeEventListener("change", this.boundHandleChange);

    this.element.addEventListener("click", this.boundHandleClick);
    this.element.addEventListener("change", this.boundHandleChange);
  }

  updateQuantity(productId, change) {
    const state = this.getState();
    const updatedCart = state.cart
      .map((item) => {
        if (item.productId === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      })
      .filter(Boolean);

    CartStorage.set(updatedCart);
    this.setState({ cart: updatedCart });
  }

  removeItem(productId) {
    const state = this.getState();
    const updatedCart = state.cart.filter((item) => item.productId !== productId);
    CartStorage.set(updatedCart);
    this.setState({ cart: updatedCart });
  }

  toggleSelectAll(checked) {
    const state = this.getState();
    const updatedCart = state.cart.map((item) => ({ ...item, selected: checked }));
    CartStorage.set(updatedCart);
    this.setState({ cart: updatedCart });
  }

  toggleItemSelection(productId, checked) {
    const state = this.getState();
    const updatedCart = state.cart.map((item) =>
      item.productId === productId ? { ...item, selected: checked } : item,
    );
    CartStorage.set(updatedCart);
    this.setState({ cart: updatedCart });
  }

  removeSelectedItems() {
    const state = this.getState();
    const updatedCart = state.cart.filter((item) => !item.selected);
    CartStorage.set(updatedCart);
    this.setState({ cart: updatedCart });

    toast.open("REMOVE");
  }

  clearCart() {
    this.setState({ cart: [] });
  }
}

// HTML 생성 함수들
const createHTML = ({ cart }) => /*html */ `
   <div class="fixed inset-0 z-50 overflow-y-auto cart-modal">
     <!-- 배경 오버레이 -->
     <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity cart-modal-overlay"></div>
          <!-- 모달 컨테이너 -->
     <div id='modal-container' class="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
     ${createModalInnerHTML({ cart })}
     </div>
   </div>`;

const createModalInnerHTML = ({ cart }) => {
  console.log(cart);
  return /*html*/ `

       <div class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
         <!-- 헤더 -->
         <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
           <h2 class="text-lg font-bold text-gray-900 flex items-center">
             <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
             </svg>
             장바구니
             ${cart.length > 0 ? `<span class="text-sm font-normal text-gray-600 ml-1">(${cart.length})</span>` : ""}
           </h2>
           <button id="cart-modal-close-btn" class="text-gray-400 hover:text-gray-600 p-1">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
             </svg>
           </button>
         </div>
         <!-- 컨텐츠 -->
         <div id="content" class="flex flex-col max-h-[calc(90vh-120px)]">
           ${
             cart.length === 0
               ? EmptyCart()
               : /*html */ `<!-- 전체 선택 섹션 -->
         <div class="p-4 border-b border-gray-200 bg-gray-50">
           <label class="flex items-center text-sm text-gray-700">
             <input type="checkbox" id="cart-modal-select-all-checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2" ${cart.every((item) => item.selected) ? "checked" : ""}>
             전체선택 (${cart.length}개)
           </label>
         </div>
         <!-- 아이템 목록 -->
         <div class="flex-1 overflow-y-auto">
           <div id="item-list" class="p-4 space-y-4">
           ${cart.length === 0 ? "" : cart.map((product) => CartItem({ product })).join("")}
           </div>
         </div>
         <!-- 하단 액션 -->
         <div id="footer" class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
           ${ModalFooter({ cart })}
         </div>`
           }
         </div>
       </div>`;
};
