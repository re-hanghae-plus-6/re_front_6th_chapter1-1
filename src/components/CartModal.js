export const CartModal = ({ cart, products }) => {
  // 장바구니에 담긴 상품들의 상세 정보
  const cartItems = cart
    .map((productId) => {
      const product = products.find((p) => p.id === productId);
      return product;
    })
    .filter(Boolean);

  // 중복 상품 개수 계산
  const cartItemsWithCount = cartItems.reduce((acc, product) => {
    const existingItem = acc.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.count++;
    } else {
      acc.push({ ...product, count: 1 });
    }
    return acc;
  }, []);

  const totalPrice = cartItemsWithCount.reduce((sum, item) => sum + item.price * item.count, 0);

  return `
    <div class="cart-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold">장바구니</h2>
          <button class="modal-close-btn text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- 장바구니 내용 -->
        <div class="cart-items">
          ${
            cartItemsWithCount.length === 0
              ? '<p class="text-gray-500 text-center py-8">장바구니가 비어있습니다.</p>'
              : `
              <div class="space-y-3">
                ${cartItemsWithCount
                  .map(
                    (item) => `
                  <div class="flex items-center justify-between p-3 border rounded">
                    <div class="flex items-center space-x-3">
                      <img src="${item.thumbnail}" alt="${item.title}" class="w-12 h-12 object-cover rounded">
                      <div>
                        <h4 class="font-medium text-sm">${item.title}</h4>
                        <p class="text-gray-500 text-xs">₩${item.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="text-sm font-medium">×${item.count}</span>
                      <button class="remove-item-btn text-red-500 hover:text-red-700" data-product-id="${item.id}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                `,
                  )
                  .join("")}
                <div class="border-t pt-3">
                  <div class="flex justify-between items-center font-bold">
                    <span>총합:</span>
                    <span>₩${totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            `
          }
        </div>
        
        <!-- 버튼들 -->
        <div class="flex gap-2 mt-4">
          <button class="modal-close-btn flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
            닫기
          </button>
          <button class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${cartItemsWithCount.length === 0 ? "opacity-50 cursor-not-allowed" : ""}" ${cartItemsWithCount.length === 0 ? "disabled" : ""}>
            주문하기
          </button>
        </div>
      </div>
    </div>
  `;
};
