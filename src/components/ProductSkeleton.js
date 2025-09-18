export const ProductSkeletonCard = () => {
  return `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div class="aspect-square bg-gray-200"></div>
      <div class="p-3">
        <div class="h-4 bg-gray-200 rounded mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div class="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  `;
};

export const ProductSkeletonGrid = ({ count = 4 } = {}) => {
  return `
    <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
      ${Array.from({ length: count })
        .map(() => ProductSkeletonCard())
        .join("")}
    </div>
  `;
};

export default ProductSkeletonCard;
