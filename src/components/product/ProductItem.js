import { formatPrice } from "../../utils/formatNumber";

/**
 * @type {
 *    brand: string
 *    category1: string
 *    category2: string
 *    category3: string
 *    category4: string
 *    hprice: string
 *    image: string
 *    link: string
 *    lprice: string
 *    maker: string
 *    mallName: string
 *    productId: string
 *    productType: string
 *    title: string
 * }
 */
export default function ProductItem(product) {
  const { productId, image, title, lprice, brand } = product;

  return /* HTML */ `<div
    class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
    data-product-id=${productId}
  >
    <!-- 상품 이미지 -->
    <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
      <img
        src="${image}"
        alt="${title}"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        loading="lazy"
      />
    </div>
    <!-- 상품 정보 -->
    <div class="p-3">
      <div class="cursor-pointer product-info mb-3">
        <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">${title}</h3>
        <p class="text-xs text-gray-500 mb-2">${brand}</p>
        <p class="text-lg font-bold text-gray-900">${formatPrice(lprice)}원</p>
      </div>
      <!-- 장바구니 버튼 -->
      <button
        class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
                         hover:bg-blue-700 transition-colors add-to-cart-btn"
        data-product-id=${productId}
      >
        장바구니 담기
      </button>
    </div>
  </div>`;
}
