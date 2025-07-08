/**
 * 상품 카드 HTML을 생성하는 함수
 * @param {Object} product - 상품 데이터
 * @returns {string} 상품 카드 HTML
 */
export function createProductCard(product) {
  const { productId, image, title, brand = "", lprice } = product;

  // 가격 포맷팅 (쉼표 추가)
  const formattedPrice = parseInt(lprice).toLocaleString();

  return `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
         data-product-id="${productId}">
      <!-- 상품 이미지 -->
      <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
        <img src="${image}"
             alt="${title}"
             class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
             loading="lazy">
      </div>
      <!-- 상품 정보 -->
      <div class="p-3">
        <div class="cursor-pointer product-info mb-3">
          <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
            ${title}
          </h3>
          <p class="text-xs text-gray-500 mb-2">${brand}</p>
          <p class="text-lg font-bold text-gray-900">
            ${formattedPrice}원
          </p>
        </div>
        <!-- 장바구니 버튼 -->
        <button class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
               hover:bg-blue-700 transition-colors add-to-cart-btn" 
               data-product-id="${productId}">
          장바구니 담기
        </button>
      </div>
    </div>
  `;
}

/**
 * 상품 목록 HTML을 생성하는 함수
 * @param {Array} products - 상품 데이터 배열
 * @returns {string} 상품 목록 HTML
 */
export function createProductList(products) {
  if (!products || products.length === 0) {
    return `
      <div class="col-span-2 text-center py-8">
        <p class="text-gray-500">상품이 없습니다.</p>
      </div>
    `;
  }

  return products.map((product) => createProductCard(product)).join("");
}
