export default function ProductList({ isLoading, fetchData }) {
  if (isLoading) {
    return /* HTML */ `
      <div class="grid grid-cols-2 gap-4 mb-6">
        ${`<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
          <div class="aspect-square bg-gray-200"></div>
          <div class="p-3">
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div class="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>`.repeat(4)}
      </div>
    `;
  }
  // 실제 상품 목록
  return /* HTML */ `
    <!-- 상품 개수 정보 -->
    <div class="mb-4 text-sm text-gray-600">
      총 <span class="font-medium text-gray-900">${fetchData.pagination.total}개</span>의 상품
    </div>
    <!-- 상품 그리드 -->
    <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
      ${fetchData.products
        .map(
          (product) => `
            <div
              class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
              data-product-id="${product.productId}"
            >
              <!-- 상품 이미지 -->
            <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
              <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover" loading="lazy" />
            </div>
            <div class="p-3">
              <div class="cursor-pointer product-info mb-3">
                <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">${product.title}</h3>
                <p class="text-xs text-gray-500 mb-2">${product.brand || ""}</p>
                <p class="text-lg font-bold text-gray-900">${product.lprice}원</p>
              </div>
              <button class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors add-to-cart-btn" data-product-id="${product.productId}">
                장바구니 담기
              </button>
            </div>
          </div>
        `,
        )
        .join("")}
    </div>
  `;
}
