export const CartModal = ({ cart }) => {
  // count 프로퍼티를 아이템에 추가
  const cartItemsWithCount = cart.reduce((acc, product) => {
    const existingItem = acc.find((item) => item.productId === product.productId);
    if (existingItem) {
      existingItem.count++;
    } else {
      acc.push({ ...product, count: 1 });
    }
    return acc;
  }, []);

  const totalPrice = cartItemsWithCount.reduce((sum, item) => sum + Number(item.lprice) * item.count, 0);

  return `
    <div class="fixed inset-0 z-50 overflow-y-auto cart-modal">
      <!-- 배경 오버레이 -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity cart-modal-overlay"></div>
      <!-- 모달 컨테이너 -->
      <div class="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
        <div class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
          <!-- 헤더 -->
          <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
              </svg>
              장바구니 (${cartItemsWithCount.length})
            </h2>
            <button class="modal-close-btn text-gray-400 hover:text-gray-600 p-1">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <!-- 컨텐츠 -->
          <div class="flex flex-col max-h-[calc(90vh-120px)]">
            ${
              cartItemsWithCount.length === 0
                ? `
                <!-- 빈 장바구니 -->
                <div class="flex-1 flex items-center justify-center p-8">
                  <div class="text-center">
                    <div class="text-gray-400 mb-4">
                      <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                      </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">장바구니가 비어있습니다</h3>
                    <p class="text-gray-600">원하는 상품을 담아보세요!</p>
                  </div>
                </div>
                `
                : `
                <!-- 상품 목록 -->
                <div class="flex-1 overflow-y-auto p-4">
                  <div class="space-y-3">
                    ${cartItemsWithCount
                      .map(
                        (item) => `
                      <div class="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <div class="flex items-center space-x-3">
                          <img src="${item.image}" alt="${item.title}" class="w-12 h-12 object-cover rounded">
                          <div>
                            <h4 class="font-medium text-sm">${item.title}</h4>
                            <p class="text-gray-500 text-xs">₩${Number(item.lprice).toLocaleString()}</p>
                          </div>
                        </div>
                        <div class='flex flex-col'> 
                        <div class="flex items-center space-x-2">
                          <span class="text-sm font-medium">×${item.count}</span>
                         
                        </div>
                                                   <button class="text-sm remove-item-btn text-red-500 hover:text-red-700" data-product-id="${item.productId}">
                            삭제
                          </button>
                        </div>
                      </div>
                    `,
                      )
                      .join("")}
                  </div>
                </div>
                <!-- 총합 및 버튼 -->
                <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                  <div class="flex justify-between items-center font-bold mb-4">
                    <span>총합:</span>
                    <span>₩${Number(totalPrice).toLocaleString()}</span>
                  </div>
                  <div class="flex gap-2">
                    <button class="modal-close-btn flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                      닫기
                    </button>
                    <button class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      주문하기
                    </button>
                  </div>
                </div>
                `
            }
          </div>
        </div>
      </div>
    </div>
  `;
};
