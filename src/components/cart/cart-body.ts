export interface CartItem {
  id: string;
  title: string;
  price: number; // 단가
  quantity: number;
  imageUrl: string;
}

/* -------------------- 빈 컨텐츠 템플릿 -------------------- */
export const 장바구니_빈컨텐츠 = `
  <div class="flex flex-col h-full">
    <div class="flex-1 flex items-center justify-center p-8">
      <div class="text-center">
        <div class="text-gray-400 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">장바구니가 비어있습니다</h3>
        <p class="text-gray-600">원하는 상품을 담아보세요!</p>
      </div>
    </div>
  </div>`;

/* -------------------- 아이템 목록 렌더링 -------------------- */
export const 장바구니_아이템리스트 = (cartItems: CartItem[]): string => {
  return cartItems
    .map(
      ({ id, title, price, quantity, imageUrl }) => `
      <div class="flex items-center py-3 border-b border-gray-100 cart-item px-4" data-product-id="${id}" data-unit-price="${price ?? 0}">
        <label class="flex items-center mr-3">
          <input type="checkbox" class="cart-item-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" data-product-id="${id}">
        </label>
        <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
          <img src="${imageUrl}" alt="${title}" class="w-full h-full object-cover cursor-pointer cart-item-image" data-product-id="${id}" />
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium text-gray-900 truncate cursor-pointer cart-item-title" data-product-id="${id}">${title}</h4>
          <p class="text-sm text-gray-600 mt-1">${price.toLocaleString()}원</p>
          <div class="flex items-center mt-2">
            <button class="quantity-decrease-btn w-7 h-7 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100" data-product-id="${id}">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
            <input type="number" value="${quantity}" min="1" class="quantity-input w-12 h-7 text-center text-sm border-t border-b border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" disabled data-product-id="${id}">
            <button class="quantity-increase-btn w-7 h-7 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100" data-product-id="${id}">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
        <div class="text-right ml-3">
          <p class="text-sm font-medium text-gray-900">${(price * quantity).toLocaleString()}원</p>
          <button class="cart-item-remove-btn mt-1 text-xs text-red-600 hover:text-red-800" data-product-id="${id}">삭제</button>
        </div>
      </div>`,
    )
    .join("");
};
