import Component from "../../lib/Component";
import { homeStore } from "../../store/homeStore";
import CartEmptyContents from "./CartEmptyContents";
import CartItem from "./CartItem";

export default class CartModal extends Component {
  renderContents() {
    const { items, selectedItems } = homeStore.getState().cart;
    const isEmpty = items.length === 0;

    if (isEmpty) return CartEmptyContents();

    const selectedCount = selectedItems.length;

    return /* HTML */ `
      <div class="flex flex-col max-h-[calc(90vh-120px)]">
        <!-- 전체 선택 섹션 -->
        <div class="p-4 border-b border-gray-200 bg-gray-50">
          <label class="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              id="cart-modal-select-all-checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
              ${selectedCount === items.length ? "checked" : ""}
            />
            전체선택 (${selectedCount}개)
          </label>
        </div>
        <!-- 아이템 목록 -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-4 space-y-4">
            ${items.length > 0 &&
            items
              .map((item) =>
                CartItem({
                  product: item.product,
                  quantity: item.quantity,
                  isSelected: selectedItems.includes(item.product.productId),
                }),
              )
              .join("")}
          </div>
        </div>
        <!-- 선택 삭제 버튼 -->
        <div class="p-4 border-t border-gray-200">
          <button
            id="cart-modal-remove-selected-btn"
            class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm"
            ${selectedCount === 0 ? "disabled" : ""}
          >
            선택 삭제 (${selectedCount}개)
          </button>
        </div>
      </div>
    `;
  }

  renderHeader() {
    const { items } = homeStore.getState().cart;
    const cartCount = items.length;

    return /* HTML */ `<div
      class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between"
    >
      <h2 class="text-lg font-bold text-gray-900 flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
          ></path>
        </svg>
        장바구니
        <span class="text-sm font-normal text-gray-600 ml-1">(${cartCount})</span>
      </h2>
      <button id="cart-modal-close-btn" class="text-gray-400 hover:text-gray-600 p-1">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>`;
  }

  renderFooter() {
    const { items, selectedItems } = homeStore.getState().cart;
    const selectedCount = selectedItems.length;

    // 유효한 아이템만 필터링
    const validItems = items.filter((item) => item && item.product && item.product.lprice);

    // 선택된 아이템들의 총 가격 계산
    const selectedPrice = validItems
      .filter((item) => selectedItems.includes(item.product.productId))
      .reduce((total, item) => total + parseInt(item.product.lprice) * item.quantity, 0);

    // 전체 가격 계산
    const totalPrice = validItems.reduce(
      (total, item) => total + parseInt(item.product.lprice) * item.quantity,
      0,
    );

    return /* HTML */ `<div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
      <!-- 선택된 아이템 정보 -->
      <div class="flex justify-between items-center mb-3 text-sm">
        <span class="text-gray-600">선택한 상품 (${selectedCount}개)</span>
        <span class="font-medium">${selectedPrice.toLocaleString()}원</span>
      </div>
      <!-- 총 금액 -->
      <div class="flex justify-between items-center mb-4">
        <span class="text-lg font-bold text-gray-900">총 금액</span>
        <span class="text-xl font-bold text-blue-600">${totalPrice.toLocaleString()}원</span>
      </div>
      <!-- 액션 버튼들 -->
      <div class="space-y-2">
        <div class="flex gap-2">
          <button
            id="cart-modal-clear-cart-btn"
            class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md 
                       hover:bg-gray-700 transition-colors text-sm"
          >
            전체 비우기
          </button>
          <button
            id="cart-modal-checkout-btn"
            class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md 
                       hover:bg-blue-700 transition-colors text-sm"
          >
            구매하기
          </button>
        </div>
      </div>
    </div>`;
  }

  template() {
    return /* HTML */ `
      <!-- 헤더 -->
      ${this.renderHeader()}

      <!-- 컨텐츠 -->
      ${this.renderContents()}

      <!-- 하단 액션 -->
      ${this.renderFooter()}
    `;
  }
}
