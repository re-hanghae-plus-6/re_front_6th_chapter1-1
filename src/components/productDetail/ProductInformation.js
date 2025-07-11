import { AddCart } from "./AddCart";
import { ReviewStar } from "./ReviewStar";

export const ProductInformation = (productDetail) => {
  const { description, image, lprice, rating, reviewCount, stock, title } = productDetail;
  return /* HTML */ `
    <div class="bg-white rounded-lg shadow-sm mb-6">
      <!-- 상품 이미지 -->
      <div class="p-4">
        <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img src="${image}" alt="${title}" class="w-full h-full object-cover product-detail-image" />
        </div>
        <!-- 상품 정보 -->
        <div>
          <p class="text-sm text-gray-600 mb-1"></p>
          <h1 class="text-xl font-bold text-gray-900 mb-3">${title}</h1>
          <!-- 평점 및 리뷰 -->
          <div class="flex items-center mb-3">
            ${ReviewStar(rating)}
            <span class="ml-2 text-sm text-gray-600">${rating} (${reviewCount}개 리뷰)</span>
          </div>
          <!-- 가격 -->
          <div class="mb-4">
            <span class="text-2xl font-bold text-blue-600">${lprice}원</span>
          </div>
          <!-- 재고 -->
          <div class="text-sm text-gray-600 mb-4">재고 ${stock}개</div>
          <!-- 설명 -->
          <div class="text-sm text-gray-700 leading-relaxed mb-6">${description}</div>
        </div>
      </div>
      <!-- 수량 선택 및 액션 -->
      ${AddCart()}
    </div>
  `;
};
