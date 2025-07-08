export default function RelatedProductItem({ product }) {
  const { productId, image, title, lprice } = product;

  return /* HTML */ ` <div
    class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer"
    data-product-id="${productId}"
  >
    <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
      <img src="${image}" alt="${title}" class="w-full h-full object-cover" loading="lazy" />
    </div>
    <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${title}</h3>
    <p class="text-sm font-bold text-blue-600">${lprice}원</p>
  </div>`;
}
