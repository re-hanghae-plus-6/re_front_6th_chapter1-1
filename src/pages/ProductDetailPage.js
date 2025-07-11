export default function ProductDetailPage({ loading = true, product = null, related = [] }) {
  if (loading || !product) {
    return `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>`;
  }

  return `
  <div class="min-h-screen bg-gray-50">
    <!-- 헤더 -->
    <header class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-md mx-auto px-4 py-4 flex items-center space-x-3">
        <button onclick="history.back()" class="p-2 text-gray-700 hover:text-gray-900 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <h1 class="text-lg font-bold text-gray-900">상품 상세</h1>
      </div>
    </header>

    <main class="max-w-md mx-auto px-4 py-4">
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover">
        </div>
        <h1 class="text-xl font-bold text-gray-900 mb-3">${product.title}</h1>

        <!-- 평점 및 리뷰 수 -->
        <div class="flex items-center mb-3">
          <div class="flex items-center">
            ${[1, 2, 3, 4, 5]
              .map(
                (n) => `<svg class="w-4 h-4 ${
                  product.rating >= n ? "text-yellow-400" : "text-gray-300"
                }" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                       </svg>`,
              )
              .join("")}
          </div>
          <span class="ml-2 text-sm text-gray-600">${product.rating.toFixed(1)} (${product.reviewCount}개 리뷰)</span>
        </div>

        <p class="text-2xl font-bold text-blue-600 mb-4">${Number(product.lprice).toLocaleString()}원</p>

        <!-- 재고 -->
        <div class="text-sm text-gray-600 mb-4">재고 ${product.stock}개</div>

        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-medium text-gray-900">수량</span>
          <div class="flex items-center">
            <button id="quantity-decrease" class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
            </button>
            <input id="quantity-input" type="number" value="1" min="1" class="w-16 h-8 text-center text-sm border-t border-b border-gray-300">
            <button id="quantity-increase" class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            </button>
          </div>
        </div>
        <button id="add-to-cart-btn" data-product-id="${product.productId}"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">
          장바구니 담기
        </button>
      </div>

      <!-- 목록 돌아가기 -->
      <div class="mb-6">
        <button class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors go-to-product-list">
          상품 목록으로 돌아가기
        </button>
      </div>

      ${
        related && related.length
          ? `
      <!-- 관련 상품 -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-900">관련 상품</h2>
        </div>
        <div class="p-4 grid grid-cols-2 gap-3">
          ${related
            .map(
              (r) => `
            <div class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer" data-product-id="${r.productId}">
              <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
                <img src="${r.image}" alt="${r.title}" class="w-full h-full object-cover" loading="lazy">
              </div>
              <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${r.title}</h3>
              <p class="text-sm font-bold text-blue-600">${Number(r.lprice).toLocaleString()}원</p>
            </div>`,
            )
            .join("")}
        </div>
      </div>`
          : ""
      }
    </main>
  </div>`;
}
