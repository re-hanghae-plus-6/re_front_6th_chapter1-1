import { CartQuantityCounter } from "./cartQuantityCounter.js";

export const CartItems = (cartItem) => {
  const { image, lprice, productId, quantity, title, checked } = cartItem;

  return `
    <div class="flex items-center py-3 border-b border-gray-100 cart-item" data-product-id="${productId}">
        <!-- 선택 체크박스 -->
        <label class="flex items-center mr-3">
            <input type="checkbox" ${checked ? "checked" : ""} class="cart-item-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded 
        focus:ring-blue-500" data-product-id="${productId}">
        </label>
        <!-- 상품 이미지 -->
        <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
            <img src="${image}" alt="${title}" class="w-full h-full object-cover cursor-pointer cart-item-image" data-product-id="${productId}">
        </div>
        <!-- 상품 정보 -->
        <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-gray-900 truncate cursor-pointer cart-item-title" data-product-id="${productId}">
            ${title}
            </h4>
            <p data-product-id="${productId}" class="cart-item-lprice text-sm text-gray-600 mt-1">
            ${Number(lprice).toLocaleString("ko-KR")}원
            </p>
            <!-- 수량 조절 -->
            ${CartQuantityCounter({ productId, quantity })}
        </div>
        <!-- 가격 및 삭제 -->
        <div class="text-right ml-3">
            <p data-product-id="${productId}" class="cart-item-price text-sm font-medium text-gray-900">
            ${Number(lprice * quantity).toLocaleString("ko-KR")}원
            </p>
            <button class="cart-item-remove-btn mt-1 text-xs text-red-600 hover:text-red-800" data-product-id="${productId}">
            삭제
            </button>
        </div>
    </div>  
`;
};
