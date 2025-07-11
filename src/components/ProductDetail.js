export function ProductDetail({ product, relatedProducts = [] }) {
  if (!product) {
    return '<div class="text-center py-20">상품 정보를 찾을 수 없습니다.</div>';
  }

  // 평점 별 렌더링
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(`
          <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        `);
      } else {
        stars.push(`
          <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        `);
      }
    }
    return stars.join('');
  };

  // 브레드크럼 렌더링
  const renderBreadcrumb = () => {
    if (!product.category1 && !product.category2) return '';

    return `
      <nav class="mb-4">
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <a href="/" data-link="" class="hover:text-blue-600 transition-colors">홈</a>
          ${
            product.category1
              ? `
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <button class="breadcrumb-link hover:text-blue-600 transition-colors" data-category1="${product.category1}">
              ${product.category1}
            </button>
          `
              : ''
          }
          ${
            product.category2
              ? `
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <button class="breadcrumb-link hover:text-blue-600 transition-colors" data-category2="${product.category2}">
              ${product.category2}
            </button>
          `
              : ''
          }
        </div>
      </nav>
    `;
  };

  // 관련 상품 렌더링
  const renderRelatedProducts = () => {
    if (relatedProducts.length === 0) return '';

    return `
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-900">관련 상품</h2>
          <p class="text-sm text-gray-600">같은 카테고리의 다른 상품들</p>
        </div>
        <div class="p-4">
          <div class="grid grid-cols-2 gap-3 responsive-grid">
            ${relatedProducts
              .map(
                (relatedProduct) => `
              <div class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer" data-product-id="${relatedProduct.id}">
                <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
                  <img src="${relatedProduct.image}" alt="${relatedProduct.name}" class="w-full h-full object-cover" loading="lazy">
                </div>
                <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${relatedProduct.name}</h3>
                <p class="text-sm font-bold text-blue-600">${relatedProduct.price.toLocaleString()}원</p>
              </div>
            `,
              )
              .join('')}
          </div>
        </div>
      </div>
    `;
  };

  const content = `
    ${renderBreadcrumb()}
    
    <!-- 상품 상세 정보 -->
    <div class="bg-white rounded-lg shadow-sm mb-6">
      <!-- 상품 이미지 -->
      <div class="p-4">
        <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover product-detail-image">
        </div>
        <!-- 상품 정보 -->
        <div>
          <p class="text-sm text-gray-600 mb-1">${product.brand || ''}</p>
          <h1 class="text-xl font-bold text-gray-900 mb-3">${product.name}</h1>
          <!-- 평점 및 리뷰 -->
          ${
            product.rating
              ? `
            <div class="flex items-center mb-3">
              <div class="flex items-center">
                ${renderStars(product.rating)}
              </div>
              <span class="ml-2 text-sm text-gray-600">${product.rating.toFixed(1)} (${product.reviewCount || 0}개 리뷰)</span>
            </div>
          `
              : ''
          }
          <!-- 가격 -->
          <div class="mb-4">
            <span class="text-2xl font-bold text-blue-600">${product.price.toLocaleString()}원</span>
          </div>
          <!-- 재고 -->
          ${
            product.stock
              ? `
            <div class="text-sm text-gray-600 mb-4">
              재고 ${product.stock}개
            </div>
          `
              : ''
          }
          <!-- 설명 -->
          ${
            product.description
              ? `
            <div class="text-sm text-gray-700 leading-relaxed mb-6">
              ${product.description}
            </div>
          `
              : ''
          }
        </div>
      </div>
      <!-- 수량 선택 및 액션 -->
      <div class="border-t border-gray-200 p-4">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-medium text-gray-900">수량</span>
          <div class="flex items-center">
            <button id="quantity-decrease" class="w-8 h-8 flex items-center justify-center border border-gray-300 
               rounded-l-md bg-gray-50 hover:bg-gray-100">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
            </button>
            <input type="number" id="quantity-input" value="1" min="1" max="${product.stock || 999}" 
                   class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 
                          focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
            <button id="quantity-increase" class="w-8 h-8 flex items-center justify-center border border-gray-300 
               rounded-r-md bg-gray-50 hover:bg-gray-100">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
          </div>
        </div>
        <!-- 액션 버튼 -->
        <button id="add-to-cart-btn" data-product-id="${product.id}" class="w-full bg-blue-600 text-white py-3 px-4 rounded-md 
             hover:bg-blue-700 transition-colors font-medium">
          장바구니 담기
        </button>
      </div>
    </div>
    
    <!-- 상품 목록으로 이동 -->
    <div class="mb-6">
      <button class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md 
        hover:bg-gray-200 transition-colors go-to-product-list">
        상품 목록으로 돌아가기
      </button>
    </div>
    
    <!-- 관련 상품 -->
    ${renderRelatedProducts()}
  `;

  return content;
}
