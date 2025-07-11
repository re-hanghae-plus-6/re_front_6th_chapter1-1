export const CartQuantityCounter = ({ productId, quantity }) => {
  return `
    <div class="flex items-center mt-2">
        <button id="cart-quantity-decrease-btn" class="quantity-decrease-btn w-7 h-7 flex items-center justify-center 
        border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100" data-product-id="${productId}">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
            </svg>
        </button>
        <input type="number" id="cart-quantity-input" value="${quantity}" min="1" class="quantity-input w-12 h-7 text-center text-sm border-t border-b 
        border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" disabled="" data-product-id="${productId}">
        <button id="cart-quantity-increase-btn" class="quantity-increase-btn w-7 h-7 flex items-center justify-center 
        border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100" data-product-id="${productId}">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
        </button>
    </div>
  `;
};
