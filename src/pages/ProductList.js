export default function ProductList({ data }) {
  const $productContainer = document.createElement("div");
  console.log("data", data);
  const products = data.products || [];
  const total = data.pagination?.total || 0;
  $productContainer.className = "mb-6";
  $productContainer.innerHTML = `   
        <!-- 상품 목록 -->
          <div>
            <!-- 상품 개수 정보 -->
            <div class="mb-4 text-sm text-gray-600">
              총 <span class="font-medium text-gray-900">${total}</span>의 상품
            </div>
            <!-- 상품 그리드 -->
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
              ${products
                .map(
                  (product) => `
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card" data-product-id="${product.productId}">
                <!-- 상품 이미지 -->
                <a href="${product.link}" target="_blank" rel="noopener noreferrer" class="aspect-square bg-gray-100 overflow-hidden cursor-pointer block">
                  <img src="${product.image}" alt="${product.title}"
                       class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                       loading="lazy">
                </a>
                <!-- 상품 정보 -->
                <div class="p-3">
                  <div class="cursor-pointer product-info mb-3">
                    <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">${product.title}</h3>
                    ${product.brand ? `<p class="text-xs text-gray-500 mb-2">${product.brand}</p>` : ""}
                    <p class="text-lg font-bold text-gray-900">${Number(product.lprice).toLocaleString()}원</p>
                  </div>
                  <!-- 장바구니 버튼 -->
                  <button class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
                         hover:bg-blue-700 transition-colors add-to-cart-btn" data-product-id="${product.productId}">
                    장바구니 담기
                  </button>
                </div>
              </div>
              `,
                )
                .join("")}
                  <!-- 장바구니 버튼 -->
                  <button class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
                         hover:bg-blue-700 transition-colors add-to-cart-btn" data-product-id="85067212996">
                    장바구니 담기
                  </button>
                </div>
              </div>
            </div>
            <div class="text-center py-4 text-sm text-gray-500">
              모든 상품을 확인했습니다
            </div>
          </div>`;
  return $productContainer;
}
