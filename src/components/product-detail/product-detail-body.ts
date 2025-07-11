import type { ProductCard } from "../product-list/index.ts";
import { 브레드크럼, createProductBreadcrumb } from "../breadcrumb/index.ts";

interface Product {
  productId: string;
  title: string;
  lprice: string;
  image: string;
  description?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  category1?: string;
  category2?: string;
}

export interface BodyProps {
  product: Product;
  relatedProducts: ProductCard[];
  qty: number;
}

export const 상품상세_본문 = ({ product, relatedProducts, qty }: BodyProps): string => {
  const priceFmt = Number(product.lprice).toLocaleString();
  const ratingHtml = Array.from({ length: 5 })
    .map((_, i) => {
      const filled = product.rating && i < Math.round(product.rating);
      return `<svg class="w-4 h-4 ${filled ? "text-yellow-400" : "text-gray-300"}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`;
    })
    .join("");

  // 브레드크럼 생성 (홈페이지와 동일하게 "전체" 사용)
  const breadcrumbItems = createProductBreadcrumb(product.category1, product.category2);
  const breadcrumbHtml = 브레드크럼({ items: breadcrumbItems });

  const relatedHtml = relatedProducts.length
    ? `<div class="bg-white rounded-lg shadow-sm">
          <div class="p-4 border-b border-gray-200">
            <h2 class="text-lg font-bold text-gray-900">관련 상품</h2>
            <p class="text-sm text-gray-600">같은 카테고리의 다른 상품들</p>
          </div>
          <div class="p-4">
            <div class="grid grid-cols-2 gap-3 responsive-grid">
              ${relatedProducts
                .map(
                  (p) => `
                  <div class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer" data-product-id="${p.id}">
                    <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
                      <img src="${p.imageUrl}" alt="${p.title}" class="w-full h-full object-cover" loading="lazy">
                    </div>
                    <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${p.title}</h3>
                    <p class="text-sm font-bold text-blue-600">${p.price.toLocaleString()}원</p>
                  </div>`,
                )
                .join("")}
            </div>
          </div>
        </div>`
    : "";

  return `
    ${breadcrumbHtml}

    <!-- 상품 상세 정보 -->
    <div class="bg-white rounded-lg shadow-sm mb-6">
      <!-- 상품 이미지 -->
      <div class="p-4">
        <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover product-detail-image">
        </div>
        <!-- 상품 정보 -->
        <div>
          <h1 class="text-xl font-bold text-gray-900 mb-3">${product.title}</h1>
          <!-- 평점 및 리뷰 -->
          <div class="flex items-center mb-3">
            <div class="flex items-center">${ratingHtml}</div>
            <span class="ml-2 text-sm text-gray-600">${product.rating ?? "-"} (${product.reviewCount ?? 0}개 리뷰)</span>
          </div>
          <!-- 가격 -->
          <div class="mb-4">
            <span class="text-2xl font-bold text-blue-600">${priceFmt}원</span>
          </div>
          <!-- 재고 -->
          ${product.stock !== undefined ? `<div class="text-sm text-gray-600 mb-4">재고 ${product.stock}개</div>` : ""}
          <!-- 설명 -->
          ${product.description ? `<div class="text-sm text-gray-700 leading-relaxed mb-6">${product.description}</div>` : ""}
        </div>
      </div>
      <!-- 수량 선택 및 액션 -->
      <div class="border-t border-gray-200 p-4">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-medium text-gray-900">수량</span>
          <div class="flex items-center">
            <button id="quantity-decrease" class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50">-</button>
            <input type="number" id="quantity-input" value="${qty}" min="1" class="w-16 text-center border-t border-b border-gray-300 py-1">
            <button id="quantity-increase" class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50">+</button>
          </div>
        </div>
        <!-- 액션 버튼 -->
        <button id="add-to-cart-btn" data-product-id="${product.productId}" data-product-price="${product.lprice}" data-product-title="${product.title}" class="w-full bg-blue-600 text-white py-3 px-4 rounded-md">장바구니 담기</button>
      </div>
    </div>

    <!-- 상품 목록으로 이동 -->
    <div class="mb-6">
      <button class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md go-to-product-list">상품 목록으로 돌아가기</button>
    </div>

    ${relatedHtml}
  `;
};
