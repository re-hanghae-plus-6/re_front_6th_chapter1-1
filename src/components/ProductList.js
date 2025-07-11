import { store } from '../store/index.js';

export function ProductList() {
  const { products, filters, loading, pagination } = store.state;

  if (loading.products) {
    return `
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div class="mb-4">
              <div class="relative">
                <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="${filters.search}" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div class="space-y-3">
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <label class="text-sm text-gray-600">카테고리:</label>
                  <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>
                </div>
              </div>
              <div class="flex gap-2 items-center justify-between">
                <div class="flex items-center gap-2">
                  <label class="text-sm text-gray-600">개수:</label>
                  <select id="limit-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                    <option value="10" ${filters.limit === 10 ? 'selected' : ''}>10개</option>
                    <option value="20" ${filters.limit === 20 ? 'selected' : ''}>20개</option>
                    <option value="50" ${filters.limit === 50 ? 'selected' : ''}>50개</option>
                    <option value="100" ${filters.limit === 100 ? 'selected' : ''}>100개</option>
                  </select>
                </div>
                <div class="flex items-center gap-2">
                  <label class="text-sm text-gray-600">정렬:</label>
                  <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                    <option value="price_asc" ${filters.sort === 'price_asc' ? 'selected' : ''}>가격 낮은순</option>
                    <option value="price_desc" ${filters.sort === 'price_desc' ? 'selected' : ''}>가격 높은순</option>
                    <option value="name_asc" ${filters.sort === 'name_asc' ? 'selected' : ''}>이름순</option>
                    <option value="name_desc" ${filters.sort === 'name_desc' ? 'selected' : ''}>이름 역순</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-6">
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
              ${Array.from({ length: 4 })
                .map(
                  () => `
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                  <div class="aspect-square bg-gray-200"></div>
                  <div class="p-3">
                    <div class="h-4 bg-gray-200 rounded mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div class="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              `,
                )
                .join('')}
            </div>
            <div class="text-center py-4">
              <div class="inline-flex items-center">
                <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
              </div>
            </div>
          </div>
    `;
  }

  return `
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div class="mb-4">
            <div class="relative">
              <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="${filters.search}" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div class="space-y-3">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">카테고리:</label>
                <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
                ${filters.category1 ? `<span class="text-xs text-gray-500">&gt;</span><button data-breadcrumb="category1" data-category1="${filters.category1}" class="text-xs hover:text-blue-800 hover:underline">${filters.category1}</button>` : ''}
                ${filters.category2 ? `<span class="text-xs text-gray-500">&gt;</span><button data-breadcrumb="category2" data-category2="${filters.category2}" class="text-xs hover:text-blue-800 hover:underline">${filters.category2}</button>` : ''}
              </div>
              <div class="flex flex-wrap gap-2">
                ${
                  loading.categories
                    ? `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`
                    : !filters.category1
                      ? `
                      ${store
                        .getAllCategory1()
                        .map(
                          (category1) => `
                        <button data-category1="${category1}" class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50">${category1}</button>
                      `,
                        )
                        .join('')}
                    `
                      : ''
                }
                ${
                  !loading.categories && filters.category1
                    ? `
                  ${store
                    .getCategoriesForCategory1(filters.category1)
                    .map(
                      (category2) => `
                    <button data-category1="${filters.category1}" data-category2="${category2}" class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors ${
                      filters.category2 === category2
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }">${category2}</button>
                  `,
                    )
                    .join('')}
                `
                    : ''
                }
              </div>
            </div>
            <div class="flex gap-2 items-center justify-between">
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">개수:</label>
                <select id="limit-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="10" ${filters.limit === 10 ? 'selected' : ''}>10개</option>
                  <option value="20" ${filters.limit === 20 ? 'selected' : ''}>20개</option>
                  <option value="50" ${filters.limit === 50 ? 'selected' : ''}>50개</option>
                  <option value="100" ${filters.limit === 100 ? 'selected' : ''}>100개</option>
                </select>
              </div>
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">정렬:</label>
                <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="price_asc" ${filters.sort === 'price_asc' ? 'selected' : ''}>가격 낮은순</option>
                  <option value="price_desc" ${filters.sort === 'price_desc' ? 'selected' : ''}>가격 높은순</option>
                  <option value="name_asc" ${filters.sort === 'name_asc' ? 'selected' : ''}>이름순</option>
                  <option value="name_desc" ${filters.sort === 'name_desc' ? 'selected' : ''}>이름 역순</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-6">
          <div>
            <div class="mb-4 text-sm text-gray-600">
              총 <span class="font-medium text-gray-900">${pagination ? pagination.total : 0}개</span>의 상품
            </div>
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
              ${products
                .map(
                  (product) => `
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card" data-product-id="${product.id}">
                  <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-200" loading="lazy">
                  </div>
                  <div class="p-3">
                    <div class="cursor-pointer product-info mb-3">
                      <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">${product.name}</h3>
                      <p class="text-xs text-gray-500 mb-2">${product.brand || ''}</p>
                      <p class="text-lg font-bold text-gray-900">${product.price.toLocaleString()}원</p>
                    </div>
                    <button class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors add-to-cart-btn" data-product-id="${product.id}">
                      장바구니 담기
                    </button>
                  </div>
                </div>
              `,
                )
                .join('')}
            </div>
            ${
              loading.loadingMore
                ? `
              <div class="text-center py-4">
                <div class="inline-flex items-center">
                  <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
                </div>
              </div>
            `
                : products.length > 0 && pagination && !pagination.hasNext
                  ? `
              <div class="text-center py-4 text-sm text-gray-500">
                모든 상품을 확인했습니다
              </div>
            `
                  : products.length === 0
                    ? `
              <div class="text-center py-8 text-gray-500">
                상품이 없습니다
              </div>
            `
                    : ''
            }
          </div>
        </div>
  `;
}
