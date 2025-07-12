const SkeletonUI = (index) => {
  return `<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse" key="${index}">
              <div class="aspect-square bg-gray-200"></div>
              <div class="p-3">
                <div class="h-4 bg-gray-200 rounded mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div class="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>`;
};
export const LoadingSkeleton = (count = 4) => {
  return Array.from({ length: count }, (_, index) => {
    return SkeletonUI(index);
  }).join("");
};
