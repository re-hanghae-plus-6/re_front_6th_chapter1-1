export const 장바구니_전체선택 = (itemsCnt: number) => `
  <div id="cart-modal-select-section" class="p-4 border-b border-gray-200 bg-gray-50">
    <label class="flex items-center text-sm text-gray-700">
      <input type="checkbox" id="cart-modal-select-all-checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2" />
      <span id="cart-modal-select-all-label">전체선택 (${itemsCnt}개)</span>
    </label>
  </div>`;
